import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../app/features/home/home.routes').then((m) => m.routes),
  },
  {
    path: 'accounts',
    loadChildren: () => import('../app/features/accounts/accounts.routes').then((m) => m.routes),
  },
  {
    path: 'auth',
    loadChildren: () => import('../app/features/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'authorization',
    loadChildren: () => import('../app/features/authorization/authorization.routes').then((m) => m.routes),
  },
  {
    path: 'errors',
    loadChildren: () => import('../app/features/errors/errors.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: '/errors/404',
    pathMatch: 'full',
  },
];
