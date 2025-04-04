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
    path: 'authorization',
    loadChildren: () => import('./features/authorization/authorization.routes').then((m) => m.routes),
  },
  {
    path: 'calendars',
    loadChildren: () => import('./features/calendars/calendars.routes').then((m) => m.routes),
  },
  {
    path: 'errors',
    loadChildren: () => import('./features/errors/errors.routes').then((m) => m.routes),
  },
  {
    path: 'resource-types',
    loadChildren: () => import('./features/resource-types/resource-types.routes').then((m) => m.routes),
  },
  {
    path: 'resources',
    loadChildren: () => import('./features/resources/resources.routes').then((m) => m.routes),
  },
  {
    path: 'pruebas',
    loadChildren: () => import('./features/pruebas/pruebas.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: '/errors/404',
    pathMatch: 'full',
  },
];
