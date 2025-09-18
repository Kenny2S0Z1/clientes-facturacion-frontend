import { Component, OnInit } from '@angular/core';
import { Cliente } from '../models/cliente';
import { ClienteService } from '../services/cliente';

import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { IClienteResponseClientesPaging } from '../interfaces/interfaces.cliente';
import { Paginator } from "../paginator/paginator";
import { IPaginatorGlobal } from '../interfaces/interfaces.global';
import { Detalle } from "./detalle/detalle";
import { Modal } from '../services/cliente/detalle/modal';
import { URL_BACKEND } from '../config/config';




@Component({
  selector: 'app-clientes',
  imports: [AsyncPipe, RouterLink, Paginator, Detalle],

  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {
  private clientesSubject = new BehaviorSubject<IClienteResponseClientesPaging | null>(null);
  urlBackend=URL_BACKEND;
  clientes$ = this.clientesSubject.asObservable();

  private paginadorSubject = new BehaviorSubject<IPaginatorGlobal | null>(null);
  paginador$ = this.paginadorSubject.asObservable();

  clienteSeleccionado!: Cliente;

  constructor(
    private clienteService: ClienteService,
    public activatedRoute: ActivatedRoute,
    public modalService: Modal
  ) {}

  ngOnInit(): void {
    this.getClientesPaging();

    this.modalService.notificarUpload.subscribe(cl => {
      const clientes = this.clientesSubject.getValue();
      if (clientes) {
        const actualizado = {
          ...clientes,
          content: clientes.content.map(value =>
            value.id === cl.id ? cl : value
          )
        };
        this.clientesSubject.next(actualizado);
      }
    });
  }

  getClientesPaging() {
    this.activatedRoute.params.subscribe(params => {
      let page: number = +params['page'];
      if (!page) page = 0;

      this.clienteService.getClientesPaging(page).subscribe(clientes => {
        this.clientesSubject.next(clientes);
        this.paginadorSubject.next(clientes);
      });
    });
  }

 delete(cliente: Cliente) {
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
        this.clienteService.delete(cliente.id).subscribe(() => {
          const clientes = this.clientesSubject.getValue();
          if (clientes) {
            const actualizado = {
              ...clientes,
              content: clientes.content.filter(c => c.id !== cliente.id)
            };
            this.clientesSubject.next(actualizado);
          }
          Swal.fire({
            title: "Deleted!",
            text: `El cliente ${cliente.nombre} ${cliente.apellido} ha sido eliminado`,
            icon: "success"
          });
        });
      }
    });
  }


  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}

