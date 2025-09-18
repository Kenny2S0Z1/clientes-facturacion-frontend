import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { Modal } from '../../services/cliente/detalle/modal';
import { DatePipe, NgStyle } from '@angular/common';
import { FacturasService } from '../../services/facturas-service';
import { Factura } from '../../models/factura';


@Component({
  selector: 'app-detalle',
  imports: [DatePipe, NgStyle, RouterLink],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css'
})
export class Detalle implements OnInit {

  @Input() cliente!: Cliente;

  titulo = "Detalle del cliente";

  progress: number = 0;
  private fotoSeleccionada: File | null = null;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute,
    public modalService: Modal, private facturaService: FacturasService
  ) { }
  ngOnInit(): void {

  }

  seleccionarFoto(event: any) {
    this.fotoSeleccionada = event.target.files[0];
    this.progress = 0;
    if (!this.fotoSeleccionada) return;

    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: 'El archivo debe ser tipo iamgen . Seleccione una imagen',
        showConfirmButton: false,
        timer: 2000
      })
      this.fotoSeleccionada = null;
    }

  }
  subirFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: 'El archivo debe ser tipo iamgen . Seleccione una imagen',
        showConfirmButton: false,
        timer: 2000
      })
      return;
    }
    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe({
      next: (response) => {
        if (response.type === HttpEventType.UploadProgress) {
          const responseTotalVerified = response.total ?? 0;
          if (responseTotalVerified > 0) {
            this.progress = Math.round(response.loaded / responseTotalVerified * 100)
          }
        } else if (response.type === HttpEventType.Response) {
          const cliente = response.body as any;
          this.cliente = cliente.cliente;
          this.modalService.notificarUpload.emit(this.cliente);
        }

      },
      error: (e) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: e.error.message,
          showConfirmButton: false,
          timer: 2000
        })
      }
    })
  }

  cerrarModal() {
    this.modalService.cerarModal();
    this.fotoSeleccionada = null;
    this.progress = 0;
  }
  eliminar(factura: Factura) {
   Swal.fire({
         title: "Are you sure?",
         text: "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Yes, delete it!"
       }).then((result) => {
         if (result.isConfirmed) {
           this.facturaService.delete(factura.id).subscribe(() => {
             
            this.cliente.facturas=this.cliente.facturas?.filter(f=>f.id!=factura.id)??null
             Swal.fire({
               title: "Deleted!",
               text: `La factura ${factura.descripcion} ha sido eliminada`,
               icon: "success"
             });
           });
         }
       });
  }

}
