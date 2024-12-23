import { Routes } from '@angular/router';
import { SystemPermissions } from '../../core/auth/constants/system-permissions.const';
import { SystemRoles } from '../../core/auth/constants/system-roles.const';
import { AuthGuard } from '../../core/guards/auth.guard';
import { HomeComponent } from './pages/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
    canActivate: [AuthGuard],
    data: {
      auth: {
        roles: [SystemRoles.Employee],
        permissions: [SystemPermissions.Appointments.Read],
        requiresAll: true,
      },
    },
  },
];
