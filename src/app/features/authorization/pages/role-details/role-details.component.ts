import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { ModuleRoleDisplayName } from '../../../../core/types/system-permissions';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumbItem';
import { PageBaseComponent } from '../../../../shared/components/pages/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/pages/page-header/page-header.component';
import { RoleWithPermissionAvailabilityByIdResponse } from '../../models/roleWithPermissionAvailabilityById.response';
import { AuthorizationApiService } from '../../services/authorization-api.service';

@Component({
  selector: 'am-role-details',
  imports: [MatCardModule, MatSlideToggleModule, PageBaseComponent, PageHeaderComponent],
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.scss',
})
export class RoleDetailsComponent {
  private readonly authorizationApiService = inject(AuthorizationApiService);
  private readonly route = inject(ActivatedRoute);

  readonly breadcrumb = new BreadcrumbCollection();
  readonly roleId = this.route.snapshot.paramMap.get('id') ?? '';

  roleInfo: RoleWithPermissionAvailabilityByIdResponse | null = null;

  constructor() {
    if (!this.roleId) {
      throw new Error('Role id is required.');
    }

    this.setBreadcrumb();
    this.loadRole();
  }

  getModuleRoleDisplayName(moduleName: string): string {
    const displayName = ModuleRoleDisplayName.get(moduleName);

    return displayName;
  }

  private setBreadcrumb(): void {
    this.breadcrumb
      .push(new BreadcrumbItem('Roles', SiteUrls.roles.list))
      .push(new BreadcrumbItem('Detalles', SiteUrls.roles.details, '', false));
  }

  private loadRole(): void {
    this.authorizationApiService
      .getRoleWithPermissionAvailabilityById(this.roleId)
      .subscribe((response) => (this.roleInfo = response));
  }
}
