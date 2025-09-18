import { Component, Input, OnInit } from '@angular/core';
import { IClienteResponseClientesPaging } from '../interfaces/interfaces.cliente';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';



@Component({
  selector: 'app-paginator',
  imports: [RouterLink, AsyncPipe, NgClass],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css'
})
export class Paginator implements OnInit {

  @Input() $paginador: Observable<IClienteResponseClientesPaging|null> = 
                  new Observable<IClienteResponseClientesPaging|null>();

  paginas: number[] = [];

  desde!: number;
  hasta!: number

  ngOnInit(): void {
  this.$paginador.subscribe({
    next: (paginador) => {
      if(!paginador)return;
      const totalPages = paginador.totalPages;
      const current = paginador.number + 1; // 1-based para la vista

      if (totalPages <= 5) {
        this.desde = 1;
        this.hasta = totalPages;
      } else {
        this.desde = Math.max(1, current - 2);
        this.hasta = Math.min(totalPages, current + 2);

        // Ajustar si estamos cerca del inicio o final
        if (current <= 3) {
          this.desde = 1;
          this.hasta = 5;
        } else if (current >= totalPages - 2) {
          this.desde = totalPages - 4;
          this.hasta = totalPages;
        }
      }
      this.paginas = [];
      for (let i = this.desde; i <= this.hasta; i++) {
        this.paginas.push(i);
      }
    }
  });
}



}
