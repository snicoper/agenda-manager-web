import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SystemPermissions } from '../../core/modules/auth/constants/system-permissions.const';
import { ResourceTypeDetailsComponent } from './pages/resource-type-details/resource-type-details.component';
import { ResourceTypeListComponent } from './pages/resource-type-list/resource-type-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ResourceTypeListComponent,
    title: 'Tipo de Recursos',
    canActivate: [AuthGuard],
    data: {
      auth: {
        permissions: [SystemPermissions.ResourceTypes.Read],
        requiresAll: true,
      },
    },
  },
  {
    path: ':id',
    component: ResourceTypeDetailsComponent,
    title: 'Detalles del Tipo de Recurso',
    canActivate: [AuthGuard],
    data: {
      auth: {
        permissions: [SystemPermissions.ResourceTypes.Read],
        requiresAll: true,
      },
    },
  },
];
