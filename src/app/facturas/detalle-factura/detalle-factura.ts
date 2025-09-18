import { Component, OnInit } from '@angular/core';
import { FacturasService } from '../../services/facturas-service';
import { Factura } from '../../models/factura';
import { ActivatedRoute, RouterLink } from '@angular/router';


@Component({
  selector: 'app-detalle-factura',
  imports: [RouterLink],
  templateUrl: './detalle-factura.html',
  styleUrl: './detalle-factura.css'
})
export class DetalleFactura implements OnInit {

  factura!: Factura;
  titulo:string='Factura'
  constructor(private facturasService:FacturasService,private activatedRoute:ActivatedRoute){
              
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params=>{
         let id= params.get('id');
      if (id){
        this.facturasService.getFactura(+id).subscribe(factura=>{
          this.factura=factura.factura
        })
      }

    })
  }


}
