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
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';
import { ResourceCategoryUtils } from '../../../../core/modules/resource-management/resource-category/resource-category.const';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { RequiredPermissionDirective } from '../../../../shared/directives/required-permission.directive';
import { ResourceTypeCreateBladeComponent } from '../../components/resource-type-create-blade/resource-type-create-blade.component';
import { ResourceTypePaginatedResponse } from '../../models/responses/resource-type-paginated.response';
import { ResourceTypeApiService } from '../../services/api/resource-type-api.service';

@Component({
  selector: 'am-resource-type-list',
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
    RequiredPermissionDirective,
  ],
  templateUrl: './resource-type-list.component.html',
  styleUrl: './resource-type-list.component.scss',
})
export class ResourceTypeListComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly apiService = inject(ResourceTypeApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly bladeService = inject(BladeService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly breadcrumb = new BreadcrumbCollection();
  readonly displayedColumns = ['name', 'description', 'category'];
  readonly fieldsFilter = ['name', 'description'];
  readonly systemPermissions = SystemPermissions;
  readonly resourceCategoryUtils = ResourceCategoryUtils;

  dataSource = new MatTableDataSource<ResourceTypePaginatedResponse>();
  paginatedResult = new PaginatedResult<ResourceTypePaginatedResponse>();
  isLoading = true;

  constructor() {
    this.setBreadcrumb();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadResourceTypes();
    });
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.paginatedResult = this.paginatedResult.handlePageEvent(pageEvent);
    this.loadResourceTypes();
  }

  handleFilterChange(paginatedResult: PaginatedResult<ResourceTypePaginatedResponse>): void {
    this.paginatedResult = paginatedResult;
    this.loadResourceTypes();
  }

  handleSortChange(sortState: Sort): void {
    this.paginatedResult.handleSortChange(sortState);
    this.loadResourceTypes();
  }

  handleCreateResourceType(): void {
    this.bladeService.open(ResourceTypeCreateBladeComponent);

    this.bladeService.result.pipe(take(1)).subscribe({
      next: (result) => {
        if (result) {
          this.loadResourceTypes();
        }
      },
    });
  }

  handleClickDetails(resourceTypeId: string): void {
    const url = UrlUtils.buildSiteUrl(SiteUrls.resourceTypes.details, { id: resourceTypeId });
    this.router.navigateByUrl(url);
  }

  protected setBreadcrumb(): void {
    this.breadcrumb.add('Tipo de recursos', SiteUrls.resourceTypes.list, '', false);
  }

  private loadResourceTypes(): void {
    this.isLoading = true;

    this.apiService
      .getResourceTypesPaginated(this.paginatedResult)
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: (response) => {
          this.paginatedResult = PaginatedResult.create<ResourceTypePaginatedResponse>(response);
          this.dataSource.data = this.paginatedResult.items;

          if (this.sort && this.paginatedResult.order) {
            this.sort.active = this.paginatedResult.order.propertyName;
            this.sort.direction = this.paginatedResult.order.orderType.toLocaleLowerCase() as SortDirection;
          }
        },
        error: () => {
          this.snackBarService.error('Error al cargar los tipos de recursos');
        },
      });
  }
}
