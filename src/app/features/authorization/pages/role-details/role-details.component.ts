import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logDebug } from '../../../../core/errors/debug-logger';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { ModuleRoleDisplayName } from '../../../../core/types/system-permissions';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumbItem';
import { PageBaseComponent } from '../../../../shared/components/pages/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/pages/page-header/page-header.component';
import {
  Permission,
  RoleWithPermissionAvailabilityByIdResponse,
} from '../../models/roleWithPermissionAvailabilityById.response';
import { UpdatePermissionForRoleRequest } from '../../models/update-permission-for-role.request';
import { AuthorizationApiService } from '../../services/authorization-api.service';

@Component({
  selector: 'am-role-details',
  imports: [MatCardModule, MatSlideToggleModule, MatIconModule, PageBaseComponent, PageHeaderComponent, AlertComponent],
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.scss',
})
export class RoleDetailsComponent {
  private readonly authorizationApiService = inject(AuthorizationApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBarService = inject(SnackBarService);

  private readonly actionOrder = ['Read', 'Update', 'Create', 'Delete'];

  readonly breadcrumb = new BreadcrumbCollection();
  readonly roleId = this.route.snapshot.paramMap.get('id') ?? '';

  role: RoleWithPermissionAvailabilityByIdResponse | null = null;
  isUpdating = false;
  roleNotFound = false;

  constructor() {
    if (!this.roleId) {
      this.roleNotFound = true;
      throw new Error('Role id is required.');
    }

    this.setBreadcrumb();
    this.loadRole();
  }

  getModuleRoleDisplayName(moduleName: string): string {
    const displayName = ModuleRoleDisplayName.get(moduleName);

    return displayName;
  }

  sortPermissionsByActionOrder(permissions: Permission[]): Permission[] {
    return this.actionOrder.map((action) => permissions.find((p) => p.action.toLowerCase() === action.toLowerCase())!);
  }

  handleUpdatePermissionForRole(permissionId: string, isAssigned: boolean): void {
    if (!this.role) {
      return;
    }

    this.isUpdating = true;

    const request = {
      isAssigned,
    } as UpdatePermissionForRoleRequest;

    this.authorizationApiService
      .updatePermissionForRole(this.role.roleId, permissionId, request)
      .pipe(finalize(() => (this.isUpdating = false)))
      .subscribe({
        next: () => {
          this.snackBarService.success('Permiso actualizado con éxito.');
          this.loadRole();
        },
        error: (error: HttpErrorResponse) => {
          logDebug(error);
        },
      });
  }

  private setBreadcrumb(): void {
    this.breadcrumb
      .push(new BreadcrumbItem('Roles', SiteUrls.roles.list))
      .push(new BreadcrumbItem('Detalles', SiteUrls.roles.details, '', false));
  }

  private loadRole(): void {
    this.authorizationApiService.getRoleWithPermissionAvailabilityById(this.roleId).subscribe({
      next: (response) => {
        this.role = response;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.roleNotFound = true;
          throw new Error('Role not found.');
        }
      },
    });
  }
}
