import { Factura } from "../models/factura";
import { GlobalApiResponse } from "./interfaces.global";

export interface IFacturaReponseGetById extends GlobalApiResponse {
    factura: Factura
}

