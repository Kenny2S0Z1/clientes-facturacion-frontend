import { Cliente } from "./cliente";
import { ItemFactura } from "./itemFactura";

export class Factura{
 id!:number;
 descripcion!:string;
 observacion!:string;
 items:ItemFactura[]=[];
 cliente!:Cliente;
 total!:number
 createAt!:string;


 calcularGranTotal():number{
    this.total=0;
    this.items.forEach(i=>{
     this.total+=i.calcularImporte();
    })
    return this.total;
 }
}