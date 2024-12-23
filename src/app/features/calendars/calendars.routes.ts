import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SystemPermissions } from '../../core/modules/auth/constants/system-permissions.const';
import { CalendarDetailsComponent } from './pages/calendar-details/calendar-details.component';
import { CalendarListComponent } from './pages/calendar-list/calendar-list.component';

export const routes: Routes = [
  {
    path: '',
    component: CalendarListComponent,
    title: 'Calendarios',
    canActivate: [AuthGuard],
    data: {
      auth: {
        permissions: [SystemPermissions.Calendars.Read],
      },
    },
  },
  {
    path: ':id',
    component: CalendarDetailsComponent,
    title: 'Detalles del calendario',
    canActivate: [AuthGuard],
    data: {
      auth: {
        permissions: [SystemPermissions.Calendars.Read],
      },
    },
  },
];
