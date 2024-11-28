import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ApiResult } from '../../../../core/api-result/api-result';
import { SiteUrls } from '../../../../core/config/site-urls';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { PageBaseComponent } from '../../../../shared/components/pages/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/pages/page-header/page-header.component';
import { RoleResponse } from '../../models/role.response';
import { AuthorizationApiService } from '../../services/authorization-api.service';

@Component({
  selector: 'am-role-list',
  imports: [MatCardModule, PageBaseComponent, PageHeaderComponent],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
})
export class RoleListComponent {
  private readonly apiService = inject(AuthorizationApiService);

  readonly breadcrumb = new BreadcrumbCollection();

  constructor() {
    this.setBreadcrumb();
    this.loadRoles();
  }

  private setBreadcrumb(): void {
    this.breadcrumb.add('Roles', SiteUrls.authorization.roles, '', false);
  }

  private loadRoles(): void {
    this.apiService.getRolesPaginated(new ApiResult<RoleResponse>()).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
