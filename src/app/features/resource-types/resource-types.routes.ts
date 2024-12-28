import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SystemPermissions } from '../../core/modules/auth/constants/system-permissions.const';
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
];
