import { Directive, ElementRef, OnInit, Renderer2, inject, input } from '@angular/core';
import { AuthService } from '../../core/modules/auth/services/auth.service';
import { AllPermissions } from '../../core/modules/auth/types/all-permissions.type';

// <!-- Múltiples permisos (necesita todos) -->
// <button
//   [amRequiredPermission]="[SystemPermissions.Users.Create, SystemPermissions.Users.Update]"
//   [requiresAll]="true">
//   Gestionar Usuarios
// </button>
@Directive({ selector: '[amRequiredPermission]' })
export class RequiredPermissionDirective implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly authService = inject(AuthService);
  private readonly renderer = inject(Renderer2);

  readonly amRequiredPermission = input<AllPermissions | AllPermissions[] | null>();
  readonly requiresAll = input<boolean>(true);

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
