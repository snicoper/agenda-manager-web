import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SystemPermissions } from '../../core/modules/auth/constants/system-permissions.const';
import { SystemRoles } from '../../core/modules/auth/constants/system-roles.const';
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
