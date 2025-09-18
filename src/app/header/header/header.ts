import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/usuario/auth-service';

import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink,AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService,private router: Router) { 
  this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
 
  }
  
  handleLogin(){
        this.authService.login();
      
  }
  handleLogout(){
        this.authService.logout();
      
        
  } 

}
