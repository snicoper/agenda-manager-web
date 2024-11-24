import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { SiteUrls } from '../config/site-urls';
import { logDebug } from '../errors/log-messages';

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

    return this.checkPermissions(route.data['permissions']);
  }

  private async handleUnauthorized(returnUrl: string): Promise<void> {
    logDebug('No autorizado');
    logDebug(`Redireccionando a ${SiteUrls.auth.login}`);
    await this.router.navigate([SiteUrls.auth.login], { queryParams: { returnUrl } });
  }

  private checkPermissions(permissions?: string[]): boolean {
    if (!permissions?.length) {
      return true;
    }

    const hasPermission = permissions.every((permission) => this.authService.hasPermission(permission));

    if (!hasPermission) {
      logDebug(`Permisos requeridos para acceder: ${permissions.join(', ')}`);
    }

    return hasPermission;
  }
}
