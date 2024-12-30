import { CommonModule } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../../../core/modules/auth/services/auth.service';
import { AllPermissions } from '../../../../core/modules/auth/types/all-permissions.type';
import { RequiredPermissionDirective } from '../../../directives/required-permission.directive';
import { RequiredRoleDirective } from '../../../directives/required-role.directive';
import { NavToolbarData } from './interfaces/nav-toolbar-data.interface';

@Component({
  selector: 'am-nav-toolbar',
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatBadgeModule,
    RequiredRoleDirective,
    RequiredPermissionDirective,
  ],
  templateUrl: './nav-toolbar.component.html',
  styleUrl: './nav-toolbar.component.scss',
})
export class NavToolbarComponent {
  private readonly authService = inject(AuthService);

  data = input.required<NavToolbarData>();
  animationDuration = model<string>('225ms');
  selectedIndex = model<number>(0);

  readonly themePalette = 'primary';

  handleSelectedIndexChange(index: number): void {
    this.selectedIndex.set(index);
  }

  hasPermission(permissions: AllPermissions | AllPermissions[] | undefined): boolean {
    if (!permissions) {
      return true;
    }

    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];

    // Usando every para verificar que todos los permisos se cumplen.
    return permissionsArray.every((permission) => this.authService.hasPermission(permission));
  }
}
