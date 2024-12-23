import { Routes } from '@angular/router';
import { SystemRoles } from '../../core/auth/constants/system-roles.const';
import { AuthGuard } from '../../core/guards/auth.guard';
import { PruebasComponent } from './pruebas.component';

export const routes: Routes = [
  {
    path: '',
    component: PruebasComponent,
    title: 'Pruebas',
    canActivate: [AuthGuard],
    data: {
      auth: {
        roles: [SystemRoles.Administrator],
        requiresAll: true,
      },
    },
  },
];
