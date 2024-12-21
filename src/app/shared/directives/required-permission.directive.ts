import { Directive, ElementRef, OnInit, Renderer2, inject, input } from '@angular/core';
import { Permission, SystemPermissionsType } from '../../core/auth/permissions/system-permissions.interface';
import { AuthService } from '../../core/auth/services/auth.service';

// <!-- Múltiples permisos (necesita todos) -->
// <button
//   [amRequiredPermission]="[SystemPermissions.Users.Create, SystemPermissions.Users.Update]"
//   [requiresAll]="true">
//   Gestionar Usuarios
// </button>

export type AllPermissions = {
  [K in keyof SystemPermissionsType]: SystemPermissionsType[K][keyof Permission];
}[keyof SystemPermissionsType];

@Directive({ selector: '[amRequiredPermission]' })
export class RequiredPermissionDirective implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly authService = inject(AuthService);
  private readonly renderer = inject(Renderer2);

  amRequiredPermission = input<AllPermissions | AllPermissions[] | null>();
  requiresAll = input<boolean>(true);

  ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, 'hidden');
    this.checkPermission();
  }

  private checkPermission(): void {
    const permissions = this.amRequiredPermission();

    if (!permissions) {
      this.showElement();

      return;
    }

    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];

    const hasPermissions = this.requiresAll()
      ? permissionsArray.every((p) => this.authService.hasPermission(p))
      : permissionsArray.some((p) => this.authService.hasPermission(p));

    if (hasPermissions) {
      this.showElement();
    }
  }

  private showElement(): void {
    this.renderer.removeClass(this.elementRef.nativeElement, 'hidden');
  }
}
