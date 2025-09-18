import { HttpInterceptorFn } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/usuario/auth-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router,private authService:AuthService) { }
  private isRefreshing = false;


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si tienes token en localStorage, se agrega al header
    const token = localStorage.getItem('token');
    let authReq = req;

    if (token) {
        
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        if (error.status === 403) {
          // Acceso prohibido → podrías redirigir a una página de error
          this.router.navigate(['/forbidden']);
        }
        return throwError(() => error);
      })
    );


  }
 private handle401Error(req: HttpRequest<any>, next: HttpHandler):
  Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      return this.authService.refreshAccessToken().pipe(
        switchMap(() => {
          this.isRefreshing = false;
          const token = this.authService.obtenerToken();
          const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
          return next.handle(authReq);
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout();
          this.authService.login(); // redirige al login
          return throwError(() => err);
        })
      );
    } else {
      // Si ya se está refrescando, esperar y luego repetir request
      return next.handle(req);
    }
  }
}

