import { Routes } from '@angular/router';
import { SystemPermissions } from '../../core/types/system-permissions';
import { RoleDetailsComponent } from './pages/role-details/role-details.component';
import { RoleListComponent } from './pages/role-list/role-list.component';

export const routes: Routes = [
  {
    path: 'roles',
    component: RoleListComponent,
    title: 'Roles',
    data: { permissions: [SystemPermissions.Roles.Read] },
  },
  {
    path: 'roles/:id',
    component: RoleDetailsComponent,
    title: 'Detalles del rol',
    data: { permissions: [SystemPermissions.Roles.Read] },
  },
];
