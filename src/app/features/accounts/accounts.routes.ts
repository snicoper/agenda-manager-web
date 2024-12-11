import { Routes } from '@angular/router';
import { AccountCreateComponent } from './pages/account-create/account-create.component';
import { AccountDetailsComponent } from './pages/account-details/account-details.component';
import { AccountListComponent } from './pages/account-list/account-list.component';
import { ConfirmAccountComponent } from './pages/confirm-account/confirm-account.component';
import { ConfirmEmailVerifyComponent } from './pages/confirm-email-verify/confirm-email-verify.component';
import { RequestPasswordResetComponent } from './pages/request-password-reset/request-password-reset.component';
import { ResendEmailConfirmationComponent } from './pages/resend-email-confirmation/resend-email-confirmation.component';
import { ResetPasswordComponent } from './pages/reset-password/confirmreset-password.component';

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
    path: 'confirm-account',
    component: ConfirmAccountComponent,
    title: 'Confirmar cuenta',
  },
  {
    path: 'request-password-reset',
    component: RequestPasswordResetComponent,
    title: 'Recuperar contraseña',
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Cambiar contraseña',
  },
  {
    path: 'resend-email-confirmation',
    component: ResendEmailConfirmationComponent,
    title: 'Enviar código de verificación',
  },
  {
    path: 'confirm-email-verify',
    component: ConfirmEmailVerifyComponent,
    title: 'Confirmar correo electrónico',
  },
  {
    path: ':id',
    component: AccountDetailsComponent,
    title: 'Detalles de cuenta',
    data: {
      permissions: ['user:read'],
    },
  },
];
