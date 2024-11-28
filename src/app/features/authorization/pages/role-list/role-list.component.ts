import { Component, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiResult } from '../../../../core/api-result/api-result';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logDebug } from '../../../../core/errors/debug-logger';
import { CommonUtils } from '../../../../core/utils/common-utils';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { PageBaseComponent } from '../../../../shared/components/pages/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/pages/page-header/page-header.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { RoleResponse } from '../../models/role.response';
import { AuthorizationApiService } from '../../services/authorization-api.service';

@Component({
  selector: 'am-role-list',
  imports: [
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinner,
    PageBaseComponent,
    PageHeaderComponent,
    TableFilterComponent,
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
})
export class RoleListComponent {
  private readonly apiService = inject(AuthorizationApiService);
  private readonly router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly breadcrumb = new BreadcrumbCollection();

  readonly displayedColumns = ['name', 'description'];
  readonly fieldsFilter = ['name', 'description'];

  dataSource!: MatTableDataSource<RoleResponse, MatPaginator>;
  apiResult = new ApiResult<RoleResponse>();
  loading = true;

  constructor() {
    this.setBreadcrumb();
    this.loadRoles();
  }

  handleSelectRow(role: RoleResponse): void {
    const url = CommonUtils.buildUrl('SiteUrl.employees.details', { id: role.id });
    this.router.navigateByUrl(url);
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.apiResult = this.apiResult.handlePageEvent(pageEvent);
    this.loadRoles();
  }

  handleFilterChange(apiResult: ApiResult<RoleResponse>): void {
    this.apiResult = apiResult;
    this.loadRoles();
  }

  handleSortChange(sortState: Sort): void {
    this.apiResult.handleSortChange(sortState);
    this.loadRoles();
  }

  private setBreadcrumb(): void {
    this.breadcrumb.add('Roles', SiteUrls.authorization.roles, '', false);
  }

  private loadRoles(): void {
    this.loading = true;
    this.apiService
      .getRolesPaginated(new ApiResult<RoleResponse>())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          logDebug(response);
          this.apiResult = ApiResult.clone<RoleResponse>(response);
          this.dataSource = new MatTableDataSource(response.items);
          this.dataSource.sort = this.sort;
        },
      });
  }
}
