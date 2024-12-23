import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ModuleRoleDisplayName } from '../../../../core/auth/constants/module-role-display-name.const';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/debug-logger';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { UrlUtils } from '../../../../shared/utils/url/url.utils';
import { UpdatePermissionForRoleRequest } from '../../interfaces/requests/update-permission-for-role.request';
import {
  GetRolePermissionsByIdResponse,
  PermissionDetail,
} from '../../interfaces/responses/get-role-permissions-by-id.response';
import { AuthorizationApiService } from '../../services/api/authorization-api.service';

@Component({
  selector: 'am-role-details',
  imports: [
    MatCardModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    PageBaseComponent,
    PageHeaderComponent,
    AlertComponent,
  ],
  templateUrl: './role-permissions.component.html',
  styleUrl: './role-permissions.component.scss',
})
export class RolePermissionsComponent {
  private readonly authorizationApiService = inject(AuthorizationApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackBarService);

  private readonly actionOrder = ['Read', 'Update', 'Create', 'Delete'];

  readonly breadcrumb = new BreadcrumbCollection();
  readonly roleId = this.route.snapshot.paramMap.get('id') ?? '';

  role: GetRolePermissionsByIdResponse | null = null;
  loading = false;
  isUpdating = false;
  roleNotFound = false;

  constructor() {
    if (!this.roleId) {
      this.roleNotFound = true;
      throw new Error('Role id is required.');
    }

    this.setBreadcrumb();
    this.loadRolePermissions();
  }

  handleNavigateToRoleUserAssignments(): void {
    const url = UrlUtils.buildSiteUrl(SiteUrls.roles.roleUserAssignments, { id: this.roleId });
    this.router.navigateByUrl(url);
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

    this.authorizationApiService
      .updatePermissionForRole(this.role.roleId, permissionId, request)
      .pipe(finalize(() => (this.isUpdating = false)))
      .subscribe({
        next: () => {
          this.snackBarService.success('Permiso actualizado con éxito.');
          this.loadRolePermissions();
        },
        error: (error: HttpErrorResponse) => logError(error),
      });
  }

  private setBreadcrumb(): void {
    this.breadcrumb.add('Roles', SiteUrls.roles.list).add('Permisos', SiteUrls.roles.permissions, '', false);
  }

  private loadRolePermissions(): void {
    this.loading = true;

    this.authorizationApiService
      .getRolePermissionsById(this.roleId)
      .pipe(finalize(() => (this.loading = false)))
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
