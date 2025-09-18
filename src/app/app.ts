import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header/header";
import { Footer } from "./footer/footer/footer";
import { Directiva } from "./directiva/directiva";
import { Clientes } from "./clientes/clientes";
import { AuthService } from './services/usuario/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Directiva, Clientes],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Bienvenido');
  guestMode:boolean=false;
  constructor(private authService:AuthService){
         this.authService.isLoggedIn$.subscribe(value=>{
          this.guestMode=!value
         })

  }

  curso='Curso Spring 5 con Angular 7 ';
}
