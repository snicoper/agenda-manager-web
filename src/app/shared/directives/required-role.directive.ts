import { Directive, ElementRef, OnInit, Renderer2, inject, input } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { SystemRole } from '../../core/types/system-roles';

// <button
//   [amRequiredRole]="[SystemRoles.Employee, SystemRoles.AssignableResource]"
//   [requiresAll]="true">
//   Gestión de Personal
// </button>

@Directive({ selector: '[amRequiredRole]' })
export class RequiredRoleDirective implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly authService = inject(AuthService);
  private readonly renderer = inject(Renderer2);

  // Permitir un rol o array de roles.
  amRequiredRole = input<SystemRole | SystemRole[] | null>();
  requiresAll = input<boolean>(true);

  ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, 'hidden');
    this.checkRole();
  }

  private checkRole(): void {
    const roles = this.amRequiredRole();

    if (!roles) {
      this.showElement();

      return;
    }

    const rolesArray = Array.isArray(roles) ? roles : [roles];

    const hasRoles = this.requiresAll()
      ? rolesArray.every((role) => this.authService.hasRole(role))
      : rolesArray.some((role) => this.authService.hasRole(role));

    if (hasRoles) {
      this.showElement();
    }
  }

  private showElement(): void {
    this.renderer.removeClass(this.elementRef.nativeElement, 'hidden');
  }
}
