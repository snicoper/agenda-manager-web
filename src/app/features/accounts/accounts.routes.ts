import { Routes } from '@angular/router';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';

export const routes: Routes = [
  {
    path: 'recovery-password',
    component: RecoveryPasswordComponent,
    title: 'Recuperar contraseña',
  },
];
