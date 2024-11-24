import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // data: { roles: [Role.Anonymous] },
    // canActivate: [AuthGuard],
    loadChildren: () => import('./features/home/home.routes').then((m) => m.routes),
  },
  {
    path: 'auth',
    // data: { roles: [Role.Anonymous] },
    // canActivate: [AuthGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'errors',
    loadChildren: () => import('./features/errors/errors.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: '/errors/404',
    pathMatch: 'full',
  },
];
