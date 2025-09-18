import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  imports: [],
  templateUrl: './directiva.html',
  styleUrl: './directiva.css'
})
export class Directiva {

  listaCurso:string[]=['TypeScript','JavaScript','Java SE ','C#','PHP'];
  habilitar=false;      
  constructor(){}

  toggleActivate(){
    this.habilitar=!this.habilitar;
  }

}
