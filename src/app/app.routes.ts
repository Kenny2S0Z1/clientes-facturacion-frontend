import { Routes } from '@angular/router';
import { Clientes } from './clientes/clientes';
import { Directiva } from './directiva/directiva';
import { Form } from './clientes/form/form';
import { Detalle } from './clientes/detalle/detalle';

import { OAtuh2RedirectComponent } from './auth/oatuh2-redirect-component/oatuh2-redirect-component';
import { Forbidden } from './auth/forbidden/forbidden';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { noAuthGuard } from './guards/no-auth-guard-guard';
import { DetalleFactura } from './facturas/detalle-factura/detalle-factura';
import { FacturaForm } from './facturas/factura-form/factura-form';


export const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: 'clientes', component: Clientes },
  { path: 'clientes/page/:page', component: Clientes },
  { path: 'directivas', component: Directiva, canActivate: [authGuard] },
  { path: 'clientes/form', component: Form, canActivate: [authGuard] },
  {
    path: 'clientes/form/:id',
    component: Form,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'clientes/ver/:id',
    component: Detalle,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'facturas/:id',
    component: DetalleFactura,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'facturas/form/:clienteid',
    component: FacturaForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  { path: 'login/oauth2/code/angularapp', component: OAtuh2RedirectComponent, canActivate: [noAuthGuard] },
  { path: 'forbidden', component: Forbidden }
];
