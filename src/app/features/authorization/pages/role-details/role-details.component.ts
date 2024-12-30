import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger';
import { SystemPermissions } from '../../../../core/modules/auth/constants/system-permissions.const';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { NavToolbarData } from '../../../../shared/components/layout/nav-toolbar/models/nav-toolbar-data.interface';
import { NavToolbarComponent } from '../../../../shared/components/layout/nav-toolbar/nav-toolbar.component';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { RoleInfoTabComponent } from '../../components/role-info-tab/role-info-tab.component';
import { RolePermissionsTabComponent } from '../../components/role-permissions-tab/role-permissions-tab.component';
import { RoleUserAssignmentsTabComponent } from '../../components/role-user-assignments-tab/role-user-assignments-tab.component';
import { RoleSelectedStateService } from '../../services/state/role-selected-state.service';

@Component({
  selector: 'am-role-details',
  imports: [MatCardModule, PageBaseComponent, PageHeaderComponent, NavToolbarComponent],
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.scss',
})
export class RoleDetailsComponent implements OnInit, OnDestroy {
  private readonly roleSelectedStateService = inject(RoleSelectedStateService);
  private readonly route = inject(ActivatedRoute);

  readonly roleId = this.route.snapshot.params['roleId'];
  readonly breadcrumb = new BreadcrumbCollection();
  readonly navData: NavToolbarData = {
    tabs: [
      {
        label: 'Información',
        icon: 'person',
        permissions: [SystemPermissions.Roles.Read],
        component: RoleInfoTabComponent,
      },
      {
        label: 'Permisos',
        icon: 'security',
        permissions: [SystemPermissions.Roles.Read],
        component: RolePermissionsTabComponent,
      },
      {
        label: 'Usuarios',
        icon: 'people',
        permissions: [SystemPermissions.Roles.Read],
        component: RoleUserAssignmentsTabComponent,
      },
    ],
  };
  readonly role = this.roleSelectedStateService.state.role;

  ngOnInit(): void {
    if (!this.roleId) {
      logError('RoleInfoTabComponent.ngOnInit', 'Role id is not defined');

      return;
    }

    this.roleSelectedStateService.load(this.roleId);
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.roleSelectedStateService.clean();
  }

  private setBreadcrumb(): void {
    this.breadcrumb.add('Roles', SiteUrls.roles.list).add('Detalles', SiteUrls.roles.details, '', false);
  }
}
