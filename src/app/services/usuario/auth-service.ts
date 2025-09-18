import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { JwtPayloadSpringBoot } from '../../models/payload';
import { URL_BACKEND } from '../../config/config';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(!!this.obtenerToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  private decodedToken: JwtPayloadSpringBoot | null = null;
  constructor(private http: HttpClient,private router: Router) {}

  /**
   * Login con Password Grant Type
   */
  login() {
   const state = crypto.randomUUID(); // valor aleatorio para CSRF
  const clientId = 'angularapp';
   const redirectUri = 'https://clientes-app-997af.web.app/login/oauth2/code/angularapp';
  const scope = 'read write';

  const authUrl = `${URL_BACKEND}/oauth2/authorize?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${encodeURIComponent(state)}`;
 
  // Redirige al login del Authorization Server
  window.location.href = authUrl;
  }

  refreshAccessToken(): Observable<any> {//El refresh token sirve para cuando se termina el token normal
    const refreshToken = this.obtenerRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);
    body.set('client_id', 'angularapp'); // tu client_id

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${URL_BACKEND}/oauth2/token`, body.toString(), 
    { headers }).pipe(
      tap((token: any) => {
        this.guardarToken(token.access_token);
        if (token.refresh_token) {
          this.guardarRefreshToken(token.refresh_token);
        }
      })
    );
  }

  private decodeToken(token: string) {
    try {
      this.decodedToken = jwtDecode<JwtPayloadSpringBoot>(token);
     console.log(this.decodedToken)
    } catch (e) {
      console.error('Error al decodificar token', e);
      this.decodedToken = null;
    }
  }
  getRoles(): string[] {
    return this.decodedToken?.authorities || this.decodedToken?.roles || [];
  }
  getUsername(): string | null {
    return this.decodedToken?.sub || null;
  }

  /**
   * Guarda access token en localStorage
   */
  guardarToken(accessToken: string) {
    localStorage.setItem('token', accessToken);
    this.decodeToken(accessToken);
     this.loggedIn.next(true);
  }

  /**
   * Guarda refresh token en localStorage
   */
   guardarRefreshToken(refreshToken: string) {
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Obtiene access token
   */
  obtenerToken(): string | null {
    
    return localStorage.getItem('token');
  }

  /**
   * Obtiene refresh token
   */
  obtenerRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

 logout() {
  // 1️⃣ Limpiar tokens locales
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');

  // 2️⃣ Actualizar estado de login
  this.loggedIn.next(false);

  // 3️⃣ Llamar al backend
  this.http.post(`${URL_BACKEND}/logout`, {},{withCredentials:true}).subscribe({
    next: () => {
      // 4️⃣ Redirigir después del logout
      this.router.navigate(['/']); // home u otra página
    },
    error: (err) => {
      console.error('Logout falló', err);
      this.router.navigate(['/']); // fallback seguro
    }
  });
}





  /**
   * Devuelve headers Authorization para requests
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.obtenerToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
