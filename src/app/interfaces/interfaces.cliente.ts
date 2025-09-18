import { Cliente } from "../models/cliente";
import { GlobalApiResponse, Pageable, Sort } from "./interfaces.global";

export interface IClienteReponseGetById extends GlobalApiResponse {
    cliente: Cliente
}

export interface ErrorFormClientes {
    field: string,
    messageError: string
}

export interface IClienteResponseCreate extends GlobalApiResponse {
    cliente?: Cliente,
    errors: ErrorFormClientes[]
}


export interface IClienteResponseClientesPaging {
    content: Cliente[],
    pageable:Pageable,
    last: true,
    totalPages: number,
    totalElements: number,
    size: number,
    number: number,
    sort:Sort,
    first: boolean,
    numberOfElements: number,
    empty: boolean
}

export interface UploadImagenCliente extends GlobalApiResponse{
    cliente:Cliente
}