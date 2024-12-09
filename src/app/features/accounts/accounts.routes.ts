import { Routes } from '@angular/router';
import { AccountCreateComponent } from './pages/account-create/account-create.component';
import { AccountDetailsComponent } from './pages/account-details/account-details.component';
import { AccountListComponent } from './pages/account-list/account-list.component';
import { ConfirmEmailResentComponent } from './pages/confirm-email-resent/confirm-email-resent.component';
import { ConfirmEmailVerifyComponent } from './pages/confirm-email-verify/confirm-email-verify.component';
import { ConfirmRecoveryPasswordComponent } from './pages/confirm-recovery-password/confirm-recovery-password.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';

export const routes: Routes = [
  {
    path: '',
    component: AccountListComponent,
    title: 'Listado de cuentas',
    data: {
      permissions: ['user:read'],
    },
  },
  {
    path: 'create',
    component: AccountCreateComponent,
    title: 'Crear cuenta',
    data: {
      permissions: ['user:create'],
    },
  },
  {
    path: ':id',
    component: AccountDetailsComponent,
    title: 'Detalles de cuenta',
    data: {
      permissions: ['user:read'],
    },
  },
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
    path: 'confirm-email-resent',
    component: ConfirmEmailResentComponent,
    title: 'Enviar código de verificación',
  },
  {
    path: 'confirm-email-verify',
    component: ConfirmEmailVerifyComponent,
    title: 'Confirmar correo electrónico',
  },
];
