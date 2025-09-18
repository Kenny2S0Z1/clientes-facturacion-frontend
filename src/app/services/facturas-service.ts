import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IFacturaReponseGetById } from '../interfaces/interfaces.factura';
import { Producto } from '../models/producto';
import { IProductoReponseFilterByTerm } from '../interfaces/interfaces.producto';
import { Factura } from '../models/factura';
import { URL_BACKEND } from '../config/config'; 

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private http = inject(HttpClient);
  private urlEndpoint =`${URL_BACKEND}/api/facturas`;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  getFactura(id: number): Observable<IFacturaReponseGetById> {

    return this.http.get<IFacturaReponseGetById>(`${this.urlEndpoint}/${id}`);
  }

  createFactura(factura: Factura): Observable<IFacturaReponseGetById> {
    return this.http.post<IFacturaReponseGetById>(`${this.urlEndpoint}`, factura, { headers: this.httpHeaders });
  }

  delete(id: number): Observable<void> {

    return this.http.delete<void>(`${this.urlEndpoint}/${id}`);
  }


  filterProductos(term: String): Observable<IProductoReponseFilterByTerm> {
    return this.http.get<IProductoReponseFilterByTerm>(`${this.urlEndpoint}/filtrar-productos/${term}`);
  }

}
