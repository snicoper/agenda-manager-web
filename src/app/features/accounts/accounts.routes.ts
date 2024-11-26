import { Routes } from '@angular/router';
import { ConfirmRecoveryPasswordComponent } from './pages/confirm-recovery-password/confirm-recovery-password.component';
import { EmailCodeResentComponent } from './pages/email-code-resent/email-code-resent.component';
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
  {
    path: 'email-code-resent',
    component: EmailCodeResentComponent,
    title: 'Enviar código de verificación',
  },
];
