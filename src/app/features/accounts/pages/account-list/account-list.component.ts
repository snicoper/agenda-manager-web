import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ApiResult } from '../../../../core/api-result/api-result';
import { SiteUrls } from '../../../../core/config/site-urls';
import { SystemPermissions } from '../../../../core/types/system-permissions';
import { CommonUtils } from '../../../../core/utils/common-utils';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumbItem';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { RequiredPermissionDirective } from '../../../../shared/directives/required-permission.directive';
import { BoolToIconPipe } from '../../../../shared/pipes/bool-to-icon.pipe';
import { AccountResponse } from '../../models/account.response';

@Component({
  selector: 'am-account-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PageBaseComponent,
    PageHeaderComponent,
    TableFilterComponent,
    PaginatorComponent,
    BoolToIconPipe,
    RequiredPermissionDirective,
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss',
})
export class AccountListComponent implements AfterViewInit {
  private readonly router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly breadcrumb = new BreadcrumbCollection();
  readonly displayedColumns = ['name', 'description', 'isEditable', 'actions'];
  readonly fieldsFilter = ['name', 'description'];
  readonly siteUrls = SiteUrls;
  readonly systemPermissions = SystemPermissions;

  dataSource = new MatTableDataSource<AccountResponse>();
  apiResult = new ApiResult<AccountResponse>();
  loading = true;

  constructor() {
    this.setBreadcrumb();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.loadAccounts();
    });
  }

  handleSelectRow(role: AccountResponse): void {
    const url = CommonUtils.buildUrl(SiteUrls.roles.permissions, { id: role.id });
    this.router.navigateByUrl(url);
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.apiResult = this.apiResult.handlePageEvent(pageEvent);
    this.loadAccounts();
  }

  handleFilterChange(apiResult: ApiResult<AccountResponse>): void {
    this.apiResult = apiResult;
    this.loadAccounts();
  }

  handleSortChange(sortState: Sort): void {
    this.apiResult.handleSortChange(sortState);
    this.loadAccounts();
  }

  private setBreadcrumb(): void {
    this.breadcrumb.push(new BreadcrumbItem('Accounts', SiteUrls.accounts.accounts, '', false));
  }

  private loadAccounts(): void {
    this.loading = true;
  }
}
