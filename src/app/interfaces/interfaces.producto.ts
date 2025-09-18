import { Producto } from "../models/producto";
import { GlobalApiResponse } from "./interfaces.global";

export interface IProductoReponseFilterByTerm extends GlobalApiResponse {
    productos:Producto[]
}