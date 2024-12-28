import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { SystemPermissions } from '../../../../core/modules/auth/constants/system-permissions.const';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { RequiredPermissionDirective } from '../../../../shared/directives/required-permission.directive';
import { PaginatedResult } from '../../../../shared/modules/paginated-result/paginated-result';
import { BoolToIconPipe } from '../../../../shared/pipes/bool-to-icon.pipe';
import { DateTimeFormatPipe } from '../../../../shared/pipes/date-time-format.pipe';
import { UrlUtils } from '../../../../shared/utils/url/url.utils';
import { AccountCreateBladeComponent } from '../../components/account-create-blade/account-create-blade.component';
import { AccountPaginatedResponse } from '../../interfaces/responses/account-paginated.response';
import { AccountApiService } from '../../services/api/account-api.service';

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
    DateTimeFormatPipe,
    RequiredPermissionDirective,
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss',
})
export class AccountListComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly apiService = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly bladeService = inject(BladeService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly breadcrumb = new BreadcrumbCollection();
  readonly displayedColumns = [
    'email',
    'firstName',
    'lastName',
    'isActive',
    'isEmailConfirmed',
    'dateJoined',
    'actions',
  ];
  readonly fieldsFilter = ['email', 'profile.firstName', 'profile.lastName'];
  readonly siteUrls = SiteUrls;
  readonly systemPermissions = SystemPermissions;

  dataSource = new MatTableDataSource<AccountPaginatedResponse>();
  paginatedResult = new PaginatedResult<AccountPaginatedResponse>();
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

  handleCreateAccount(): void {
    this.bladeService.show(AccountCreateBladeComponent);

    this.bladeService.result.pipe(take(1)).subscribe({
      next: (result) => {
        if (result) {
          this.loadAccounts();
        }
      },
    });
  }

  handleClickDetails(userId: string): void {
    const url = UrlUtils.buildSiteUrl(SiteUrls.accounts.details, { id: userId });
    this.router.navigateByUrl(url);
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.paginatedResult = this.paginatedResult.handlePageEvent(pageEvent);
    this.loadAccounts();
  }

  handleFilterChange(paginatedResult: PaginatedResult<AccountPaginatedResponse>): void {
    this.paginatedResult = paginatedResult;
    this.loadAccounts();
  }

  handleSortChange(sortState: Sort): void {
    this.paginatedResult.handleSortChange(sortState);
    this.loadAccounts();
  }

  private setBreadcrumb(): void {
    this.breadcrumb.add('Cuentas', SiteUrls.accounts.list, '', false);
  }

  private loadAccounts(): void {
    this.loading = true;

    this.apiService
      .getAccountsPaginated(this.paginatedResult)
      .pipe(
        take(1),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: (response) => {
          this.paginatedResult = PaginatedResult.create<AccountPaginatedResponse>(response);
          this.dataSource.data = this.paginatedResult.items;

          if (this.sort && this.paginatedResult.order) {
            this.sort.active = this.paginatedResult.order.propertyName;
            this.sort.direction = this.paginatedResult.order.orderType.toLowerCase() as SortDirection;
          }
        },
        error: () => this.snackBarService.error('Ha ocurrido un error al cargar las cuentas.'),
      });
  }
}
