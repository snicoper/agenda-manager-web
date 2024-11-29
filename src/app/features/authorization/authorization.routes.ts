import { Routes } from '@angular/router';
import { SystemPermissions } from '../../core/types/system-permissions';
import { RoleCreateComponent } from './pages/role-create/role-create.component';
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
    path: 'roles/create',
    component: RoleCreateComponent,
    title: 'Crear nuevo rol',
    data: { permissions: [SystemPermissions.Roles.Create] },
  },
  {
    path: 'roles/:id',
    component: RoleDetailsComponent,
    title: 'Detalles del rol',
    data: { permissions: [SystemPermissions.Roles.Read] },
  },
];
