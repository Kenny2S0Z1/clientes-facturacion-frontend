import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/usuario/auth-service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['roles'] || [];
  const userRoles = authService.getRoles();

  const hasRole = expectedRoles.some(role => userRoles.includes(role));

  if (!hasRole) {
    router.navigate(['/forbidden']);
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Error",
      text: 'Permisos insuficientes',
      showConfirmButton: false,

    })
    return false;
  }

  return true;
};
