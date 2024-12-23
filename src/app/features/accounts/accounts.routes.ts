import { Routes } from '@angular/router';
import { SystemPermissions } from '../../core/auth/constants/system-permissions.const';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AccountDetailsComponent } from './pages/account-details/account-details.component';
import { AccountListComponent } from './pages/account-list/account-list.component';
import { ConfirmAccountComponent } from './pages/confirm-account/confirm-account.component';
import { RequestPasswordResetComponent } from './pages/request-password-reset/request-password-reset.component';
import { ResendEmailConfirmationComponent } from './pages/resend-email-confirmation/resend-email-confirmation.component';
import { ResetPasswordComponent } from './pages/reset-password/confirmreset-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';

export const routes: Routes = [
  {
    path: '',
    component: AccountListComponent,
    title: 'Listado de cuentas',
    canActivate: [AuthGuard],
    data: {
      auth: {
        permissions: [SystemPermissions.Users.Read],
        requiresAll: true,
      },
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
    title: 'Solicitar cambio de contraseña',
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Cambiar contraseña',
  },
  {
    path: 'resend-email-confirmation',
    component: ResendEmailConfirmationComponent,
    title: 'Reenviar correo electrónico de confirmación',
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
    title: 'Verificar correo electrónico',
  },
  {
    path: ':userId',
    component: AccountDetailsComponent,
    title: 'Detalles de cuenta',
    canActivate: [AuthGuard],
    data: {
      auth: {
        permissions: [SystemPermissions.Users.Read],
        requiresAll: true,
      },
    },
  },
];
