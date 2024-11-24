import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { HomeComponent } from './pages/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
    canActivate: [AuthGuard],
    data: { permissions: ['user:create', 'user:create'] },
  },
];
