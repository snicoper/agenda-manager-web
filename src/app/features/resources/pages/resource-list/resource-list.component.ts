import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
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
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { RequiredPermissionDirective } from '../../../../shared/directives/required-permission.directive';
import { BoolToIconPipe } from '../../../../shared/pipes/bool-to-icon.pipe';
import { DateTimeFormatPipe } from '../../../../shared/pipes/date-time-format.pipe';
import { ResourceResponse } from '../../models/responses/resource.response';
import { ResourceApiService } from '../../services/api/resource-api.service';

@Component({
  selector: 'am-resource-list',
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
  templateUrl: './resource-list.component.html',
  styleUrl: './resource-list.component.scss',
})
export class ResourceListComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly apiService = inject(ResourceApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly bladeService = inject(BladeService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly loading = signal(false);

  readonly breadcrumb = new BreadcrumbCollection();
  readonly displayedColumns = [
    'name',
    'description',
    'textColor',
    'backgroundColor',
    'isActive',
    'deactivationReason',
    'createdAt',
  ];
  readonly fieldsFilter = ['name', 'description', 'deactivationReason'];
  readonly siteUrls = SiteUrls;
  readonly systemPermissions = SystemPermissions;

  dataSource = new MatTableDataSource<ResourceResponse, MatPaginator>();
  paginatedResult = new PaginatedResult<ResourceResponse>();

  constructor() {
    this.setBreadcrumb();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.loadResources();
    });
  }

  handleCreateResource(): void {
    // this.bladeService.show(ResourceCreateBladeComponent);
  }

  handleClickDetails(resourceId: string): void {
    const url = UrlUtils.buildSiteUrl(SiteUrls.resources.details, { id: resourceId });
    this.router.navigateByUrl(url);
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.paginatedResult = this.paginatedResult.handlePageEvent(pageEvent);
    this.loadResources();
  }

  handleFilterChange(paginatedResult: PaginatedResult<ResourceResponse>): void {
    this.paginatedResult = paginatedResult;
    this.loadResources();
  }

  handleSortChange(sortState: Sort): void {
    this.paginatedResult.handleSortChange(sortState);
    this.loadResources();
  }

  private setBreadcrumb(): void {
    this.breadcrumb.add('Recursos', this.siteUrls.resources.list, '', false);
  }

  private loadResources(): void {
    this.loading.set(true);

    this.apiService
      .getResourcesPaginated(this.paginatedResult)
      .pipe(
        take(1),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.paginatedResult = PaginatedResult.create<ResourceResponse>(response);
          this.dataSource.data = this.paginatedResult.items;

          if (this.sort && this.paginatedResult.order) {
            this.sort.active = this.paginatedResult.order.propertyName;
            this.sort.direction = this.paginatedResult.order.orderType.toLowerCase() as SortDirection;
          }
        },
      });
  }
}
