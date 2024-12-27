import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { SiteUrls } from '../config/site-urls';
import { logError } from '../errors/logger/logger.co';
import { RouteAuthConfig } from '../modules/auth/interfaces/router-auth-config.interface';
import { AuthService } from '../modules/auth/services/auth.service';
import { SystemRole } from '../modules/auth/types/system-roles.type';

//   {
//     path: 'appointments',
//     component: AppointmentsComponent,
//     data: {
//       auth: {
//         roles: [SystemRoles.Customer, SystemRoles.Employee],
//         permissions: [SystemPermissions.Appointments.Read],
//         requiresAll: false // necesita ser customer O employee Y tener el permiso
//       }
//     },
//     canActivate: [AuthGuard]
//   }
@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.authService.isExpired()) {
      await this.handleUnauthorized(state.url);

      return false;
    }

    if (!this.authService.authState.isLoggedIn()) {
      await this.handleUnauthorized(state.url);

      return false;
    }

    const config: RouteAuthConfig = route.data['auth'];

    return this.checkAuthorization(config);
  }

  private async handleUnauthorized(returnUrl: string): Promise<void> {
    await this.router.navigate([SiteUrls.auth.login], { queryParams: { returnUrl } });
  }

  private checkAuthorization(config?: RouteAuthConfig): boolean {
    if (!config?.permissions?.length && !config?.roles?.length) {
      return true;
    }

    const requiresAll = config.requiresAll ?? true;

    const hasPermissions = this.checkPermissions(config.permissions, requiresAll);
    const hasRoles = this.checkRoles(config.roles, requiresAll);

    return hasPermissions && hasRoles;
  }

  private checkPermissions(permissions?: string[], requiresAll = true): boolean {
    if (!permissions?.length) {
      return true;
    }

    const hasPermissions = requiresAll
      ? permissions.every((permission) => this.authService.hasPermission(permission))
      : permissions.some((permission) => this.authService.hasPermission(permission));

    if (!hasPermissions) {
      logError('AuthGuard.checkPermissions', `Permisos requeridos para acceder: ${permissions.join(', ')}`);
    }

    return hasPermissions;
  }

  private checkRoles(roles?: SystemRole[], requiresAll = true): boolean {
    if (!roles?.length) {
      return true;
    }

    const hasRoles = requiresAll
      ? roles.every((role) => this.authService.hasRole(role))
      : roles.some((role) => this.authService.hasRole(role));

    if (!hasRoles) {
      logError('AuthGuard.checkRoles', `Roles requeridos para acceder: ${roles.join(', ')}`);
    }

    return hasRoles;
  }
}
