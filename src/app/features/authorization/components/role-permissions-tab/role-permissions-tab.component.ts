import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { finalize, take } from 'rxjs';
import { logError } from '../../../../core/errors/logger/logger';
import { ModuleRoleDisplayName } from '../../../../core/modules/auth/constants/module-role-display-name.const';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { AuthorizationApiService } from '../../services/api/authorization-api.service';
import { RoleSelectedStateService } from '../../services/state/role-selected-state.service';
import { UpdatePermissionForRoleRequest } from '../../models/requests/update-permission-for-role.request';
import {
  GetRolePermissionsByIdResponse,
  PermissionDetail,
} from '../../models/responses/get-role-permissions-by-id.response';

@Component({
  selector: 'am-role-permissions-tab',
  imports: [MatSlideToggleModule, MatIconModule, MatProgressSpinnerModule, AlertComponent],
  templateUrl: './role-permissions-tab.component.html',
  styleUrl: './role-permissions-tab.component.scss',
})
export class RolePermissionsTabComponent {
  private readonly apiService = inject(AuthorizationApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly roleSelectedStateService = inject(RoleSelectedStateService);

  private readonly actionOrder = ['Read', 'Update', 'Create', 'Delete'];

  role: GetRolePermissionsByIdResponse | null = null;
  loading = false;
  isUpdating = false;
  roleNotFound = false;

  constructor() {
    this.loadRolePermissions();
  }

  getModuleRoleDisplayName(moduleName: string): string {
    const displayName = ModuleRoleDisplayName.get(moduleName);

    return displayName;
  }

  sortPermissionsByActionOrder(permissions: PermissionDetail[]): (PermissionDetail | null)[] {
    return this.actionOrder.map(
      (action) => permissions.find((p) => p.action.toLowerCase() === action.toLowerCase()) || null,
    );
  }

  getToggleState(item: PermissionDetail | null): { show: boolean; disabled: boolean } {
    if (!item) {
      return { show: false, disabled: true };
    }

    return {
      show: true,
      disabled: this.isUpdating || !this.role?.roleIsEditable,
    };
  }

  handleUpdatePermissionForRole(permissionId: string, isAssigned: boolean): void {
    if (!this.role) {
      return;
    }

    this.isUpdating = true;

    const request: UpdatePermissionForRoleRequest = {
      isAssigned,
    } as const;

    this.apiService
      .updatePermissionForRole(this.role.roleId, permissionId, request)
      .pipe(
        take(1),
        finalize(() => (this.isUpdating = false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Permiso actualizado con éxito.');
          this.loadRolePermissions();
        },
        error: (error: HttpErrorResponse) => logError('RolePermissionsComponent.handleUpdatePermissionForRole', error),
      });
  }

  private loadRolePermissions(): void {
    this.loading = true;

    this.apiService
      .getRolePermissionsById(this.roleSelectedStateService.state.roleId()!)
      .pipe(
        take(1),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: (response) => (this.role = response),
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.roleNotFound = true;
            throw new Error('Role not found.');
          }
        },
      });
  }
}
