import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    // data: { roles: [Role.Anonymous] },
    // canActivate: [AuthGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.routes),
  },
];
