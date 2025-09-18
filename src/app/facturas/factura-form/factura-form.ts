import { Component, OnInit } from '@angular/core';
import { Factura } from '../../models/factura';
import { ClienteService } from '../../services/cliente';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Producto } from '../../models/producto';
import { FacturasService } from '../../services/facturas-service';
import { ItemFactura } from '../../models/itemFactura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-factura-form',
  imports: [RouterLink, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule,
    ReactiveFormsModule],
  templateUrl: './factura-form.html',
  styleUrl: './factura-form.css'
})
export class FacturaForm implements OnInit {
  autocompleteControl = new FormControl();
  productoInput: string = '';
  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();
  productoSeleccionado: Producto | null = null;
  productosFiltrados: Producto[] = [];
  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute,
    private facturaService: FacturasService, private router: Router
  ) { }


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteid = params.get('clienteid');
      if (clienteid) {
        this.clienteService.getCliente(+clienteid).subscribe(response => {
          this.factura.cliente = response.cliente;
        })
      }
    })
  }

  filtrarProductos(valor: string | Producto) {
    // si es un objeto Producto, tomar el nombre
    if (typeof valor !== 'string') {
      valor = valor?.nombre ?? '';
    }

    if (!valor.trim()) {
      this.productosFiltrados = [];
      return;
    }

    this.facturaService.filterProductos(valor.toLowerCase())
      .subscribe(resp => {
        this.productosFiltrados = resp.productos;
      });
  }

  mostrarNombre(producto?: Producto) {
    return producto?.nombre ?? ''
  }

  seleccionarProducto(producto: Producto) {
    this.productoSeleccionado = producto;

    if (this.existsItem(producto.id)) {
      this.incrementarCantidad(producto.id);
    } else {
      const nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    // limpiar input
    this.productoInput = '';
    this.productoSeleccionado = null;
    this.productosFiltrados = [];
  }
  actualizarCantidad(id: number, event: any) {
    const cantidad = Number(event.target.value) || 0;

    if (cantidad == 0) {
      this.eliminarItem(id);
      return;
    }

    const item = this.factura.items.find(i => i.producto.id === id);
    if (item) {
      item.cantidad = cantidad;
    }
  }

  existsItem(id: number) {
    return this.factura.items.some(item => item.producto.id === id);
  }
  incrementarCantidad(id: number) {
    this.factura.items = this.factura.items.map(i => {
      if (id === i.producto.id) {
        ++i.cantidad;
      }
      return i;
    })
  }
  eliminarItem(id: number) {
    this.factura.items = this.factura.items.filter(i => i.producto.id !== id)
  }


  crearFactura() {
    this.facturaService.createFactura(this.factura).subscribe(
      {
        next: (response) => {
          this.factura = response.factura
          this.router.navigate(['/clientes']);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Factura creada",
            text:response.message,
            showConfirmButton: false,
            timer: 2000
          });
        }
      }
    )
  }


}  
