import { Routes } from '@angular/router';
import { SystemPermissions } from '../../core/auth/permissions/system-permissions.const';
import { AuthGuard } from '../../core/guards/auth.guard';
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
];
