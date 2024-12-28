import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SystemPermissions } from '../../core/modules/auth/constants/system-permissions.const';
import { ResourceTypesListComponent } from './pages/resource-types-list/resource-types-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ResourceTypesListComponent,
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
