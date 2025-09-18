import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/usuario/auth-service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.obtenerToken();

  if (token) {
    // Si ya hay token, redirige al home
    router.navigate(['/']);
    return false;
  }

  return true; // Solo si NO hay token
};
