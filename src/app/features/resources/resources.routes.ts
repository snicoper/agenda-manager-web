import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SystemPermissions } from '../../core/modules/auth/constants/system-permissions.const';
import { ResourceDetailsComponent } from './pages/resource-details/resource-details.component';
import { ResourceListComponent } from './pages/resource-list/resource-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ResourceListComponent,
    title: 'Recursos',
    canActivate: [AuthGuard],
    data: {
      auth: {
        permissions: [SystemPermissions.Resources.Read],
        requiresAll: true,
      },
    },
  },
  {
    path: ':resourceId',
    component: ResourceDetailsComponent,
    title: 'Detalles del recurso',
    canActivate: [AuthGuard],
    data: {
      auth: {
        permissions: [SystemPermissions.Resources.Read],
        requiresAll: true,
      },
    },
  },
];
