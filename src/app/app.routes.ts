import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.routes),
  },
  {
    path: 'accounts',
    loadChildren: () => import('./features/accounts/accounts.routes').then((m) => m.routes),
  },
  {
    path: 'auth',
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
