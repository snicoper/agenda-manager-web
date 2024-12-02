import { Routes } from '@angular/router';
import { SystemPermissions } from '../../core/types/system-permissions';
import { RoleListComponent } from './pages/role-list/role-list.component';
import { RolePermissionsComponent } from './pages/role-permissions/role-permissions.component';
import { RoleUserAssignmentsComponent } from './pages/role-user-assignments/role-user-assignments.component';

export const routes: Routes = [
  {
    path: 'roles',
    component: RoleListComponent,
    title: 'Roles',
    data: { permissions: [SystemPermissions.Roles.Read] },
  },
  {
    path: 'roles/:id/permissions',
    component: RolePermissionsComponent,
    title: 'Detalles del rol',
    data: { permissions: [SystemPermissions.Roles.Read] },
  },
  {
    path: 'roles/:id/user-assignments',
    component: RoleUserAssignmentsComponent,
    title: 'Asignación de usuarios',
    data: { permissions: [SystemPermissions.Roles.Update] },
  },
];
