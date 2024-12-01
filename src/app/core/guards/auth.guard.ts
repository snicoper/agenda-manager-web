import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { SiteUrls } from '../config/site-urls';
import { logDebug } from '../errors/debug-logger';
import { SystemRole } from '../types/system-roles';

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

interface RouteAuthConfig {
  permissions?: string[];
  roles?: SystemRole[];
  requiresAll?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.authService.isExpired()) {
      await this.handleUnauthorized(state.url);

      return false;
    }

    if (!this.authService.isLoggedIn()) {
      await this.handleUnauthorized(state.url);

      return false;
    }

    const config = route.data['auth'] as RouteAuthConfig;

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
      logDebug(`Permisos requeridos para acceder: ${permissions.join(', ')}`);
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
      logDebug(`Roles requeridos para acceder: ${roles.join(', ')}`);
    }

    return hasRoles;
  }
}
