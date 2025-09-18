import { inject, Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { clientes } from '../../util/clientes';
import { map, Observable, of, catchError, throwError, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { IClienteReponseGetById, IClienteResponseClientesPaging, IClienteResponseCreate, UploadImagenCliente } from '../interfaces/interfaces.cliente';
import { DatePipe, formatDate } from '@angular/common';
import { Region } from '../models/region';
import { URL_BACKEND } from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);
  private urlEndpoint = `${URL_BACKEND}/api/clientes`;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private router: Router) { }


   getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.urlEndpoint}/regiones` );
  }

  getClientes(): Observable<Cliente[]> {
    return this.http.get(this.urlEndpoint).pipe(
      tap(response => {
        let clientes = response as Cliente[];
        clientes.forEach(cliente => {
          console.log(cliente.nombre)
        })
      }),
      map(response => {
        let clientes = response as Cliente[];
        return clientes.map(c => {
          c.nombre = c.nombre.toUpperCase();
          c.apellido = c.apellido.toUpperCase();
          c.createAt = new DatePipe('en-US').transform(c.createAt, 'EEEE dd, MMMM') ?? ''
          return c;
        })

      }
      )
    );
  }
  getClientesPaging(page: number): Observable<IClienteResponseClientesPaging> {

    return this.http.get<IClienteResponseClientesPaging>(`${this.urlEndpoint}/page/${page}`)
      .pipe(

        map(response => {
          let responseGeneral = response as IClienteResponseClientesPaging;

          responseGeneral.content.map(c => {
            c.nombre = c.nombre.toUpperCase();
            c.apellido = c.apellido.toUpperCase();
            c.createAt = new DatePipe('en-US').transform(c.createAt, 'EEEE dd, MMMM') ?? ''
            return c;
          })
          return responseGeneral;

        }
        )
      );
  }

  create(cliente: Cliente): Observable<IClienteResponseCreate> {
    return this.http.post<IClienteResponseCreate>(this.urlEndpoint, cliente, { headers: this.httpHeaders })
  }


  getCliente(id: number): Observable<IClienteReponseGetById> {
    return this.http.get<IClienteReponseGetById>(`${this.urlEndpoint}/${id}`)
  }

  update(cliente: Cliente): Observable<IClienteResponseCreate> {
    return this.http.put<IClienteResponseCreate>(`${this.urlEndpoint}/${cliente.id}`, cliente)

  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete(`${this.urlEndpoint}/${id}`, { headers: this.httpHeaders }).pipe(
      map(response => response as Cliente)
    );
  }

  subirFoto(archivo: File, id: number): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    formData.append("archivo", archivo);

    formData.append("id", id.toString());


    const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`, formData, {
      reportProgress: true
    })

    return this.http.request(req);

  }
}
