import { Routes } from '@angular/router';
import { SystemPermissions } from '../../core/types/system-permissions';
import { RoleListComponent } from './role-list/role-list.component';

export const routes: Routes = [
  {
    path: 'roles',
    component: RoleListComponent,
    title: 'Roles',
    data: { permissions: [SystemPermissions.Roles.Read] },
  },
];
