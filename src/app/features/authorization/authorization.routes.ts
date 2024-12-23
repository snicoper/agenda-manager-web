import { Routes } from '@angular/router';
import { SystemPermissions } from '../../core/auth/constants/system-permissions.const';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleListComponent } from './pages/role-list/role-list.component';
import { RolePermissionsComponent } from './pages/role-permissions/role-permissions.component';
import { RoleUserAssignmentsComponent } from './pages/role-user-assignments/role-user-assignments.component';

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
    path: 'roles/:id/permissions',
    component: RolePermissionsComponent,
    title: 'Detalles del rol',
    canActivate: [AuthGuard],
    data: {
      auth: {
        permissions: [SystemPermissions.Roles.Read],
        requiresAll: true,
      },
    },
  },
  {
    path: 'roles/:id/user-assignments',
    component: RoleUserAssignmentsComponent,
    title: 'Asignación de usuarios',
    canActivate: [AuthGuard],
    data: {
      auth: {
        permissions: [SystemPermissions.Roles.Update],
        requiresAll: true,
      },
    },
  },
];
