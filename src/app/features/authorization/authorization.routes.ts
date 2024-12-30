import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SystemPermissions } from '../../core/modules/auth/constants/system-permissions.const';
import { RoleDetailsComponent } from './pages/role-details/role-details.component';
import { RoleListComponent } from './pages/role-list/role-list.component';

export const routes: Routes = [
  {
    path: 'roles',
    component: RoleListComponent,
    title: 'Roles',
    canActivate: [AuthGuard],
    data: {
      auth: {
        permissions: [SystemPermissions.Roles.Read],
        requiresAll: true,
      },
    },
  },
  {
    path: 'roles/:roleId',
    component: RoleDetailsComponent,
    title: 'Detalles del rol',
    canActivate: [AuthGuard],
    data: {
      auth: {
        permissions: [SystemPermissions.Roles.Read],
        requiresAll: true,
      },
    },
  },
];
