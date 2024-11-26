import { Routes } from '@angular/router';
import { ConfirmRecoveryPasswordComponent } from './pages/confirm-recovery-password/confirm-recovery-password.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';

export const routes: Routes = [
  {
    path: 'recovery-password',
    component: RecoveryPasswordComponent,
    title: 'Recuperar contraseña',
  },
  {
    path: 'confirm-recovery-password',
    component: ConfirmRecoveryPasswordComponent,
    title: 'Cambiar contraseña',
  },
];
