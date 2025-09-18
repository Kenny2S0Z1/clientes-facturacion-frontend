import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ErrorFormClientes } from '../../interfaces/interfaces.cliente';
import { MatHint } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Region } from '../../models/region';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-form',
  providers:[provideNativeDateAdapter()],
  imports: [FormsModule,MatHint,MatDatepickerModule,AsyncPipe],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form implements OnInit {
  titulo: string = "Crear Cliente";

  cliente: Cliente = new Cliente();
  errors:ErrorFormClientes[]=[];

   private regionesSubject = new BehaviorSubject<Region[]>([]);
    regiones$ = this.regionesSubject.asObservable();

  constructor(private clienteService: ClienteService, private router: Router,
    private activatedRouted: ActivatedRoute) { }
  ngOnInit(): void {

    this.cargarCliente();
    this.cargarRegiones();
  }
 cargarRegiones(){
   this.clienteService.getRegiones().subscribe(regiones=>{
        this.regionesSubject.next(regiones);
   }
   )
 }
  create() {
    this.clienteService.create(this.cliente).subscribe({
      next: (response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.cliente?.nombre,
          text: response.message,
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        this.errors= err.error.errors;
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error",
          text: err.error.message,
          showConfirmButton: false,
         
        })
      }

    });
  }


  update() {
    this.cliente.facturas=null;
    this.clienteService.update(this.cliente).subscribe(
      {
        next: (response) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.cliente?.nombre,
            text: response.message,
            showConfirmButton: false,
            timer: 2000
          });
          this.router.navigate(['/clientes']);
        },
        error: (e) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Error",
            text: e.error.message,
            showConfirmButton: false,
            timer: 2000
          });
        }
      }
    )
  }

  cargarCliente() {
    this.activatedRouted.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.clienteService.getCliente(id).subscribe(
          {
            next: (response) => {
              this.cliente = response.cliente
            },
            error: (e) => {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Error",
                text: e.error.message,
                showConfirmButton: false,
                timer: 2000
              });
            }
          }
        )
      }
    })
  }

  compararRegion(regionItem:Region,regionCliente:Region){
        if(regionItem ==null && regionCliente==null){
           return true;
        }
        return regionItem== null || regionCliente == null? false: regionItem.id===regionCliente.id
  }



}
