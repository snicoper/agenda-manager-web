import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SystemRoles } from '../../core/modules/auth/constants/system-roles.const';
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
