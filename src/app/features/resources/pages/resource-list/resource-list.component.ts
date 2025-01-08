import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, inject, signal, ViewChild } from '@angular/core';
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
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/models/breadcrumb-collection.model';
import { DotBackgroundColorComponent } from '../../../../shared/components/dots/dot-background-color/dot-background-color.component';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { CalendarSelectorIdStateService } from '../../../../shared/components/selectors/calendar-selector/services/state/calendar-selector-id-state.service';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { RequiredPermissionDirective } from '../../../../shared/directives/required-permission.directive';
import { BoolToIconPipe } from '../../../../shared/pipes/bool-to-icon.pipe';
import { DateTimeFormatPipe } from '../../../../shared/pipes/date-time-format.pipe';
import { ResourceCreateBladeComponent } from '../../components/resource-create-blade/resource-create-blade.component';
import { ResourcePaginatedResponse } from '../../models/responses/resource-paginated.response';
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
    DotBackgroundColorComponent,
    AlertComponent,
    BoolToIconPipe,
    DateTimeFormatPipe,
    RequiredPermissionDirective,
  ],
  templateUrl: './resource-list.component.html',
  styleUrl: './resource-list.component.scss',
})
export class ResourceListComponent implements AfterViewInit {
  private readonly apiService = inject(ResourceApiService);
  private readonly calendarSelectorIdStateService = inject(CalendarSelectorIdStateService);
  private readonly bladeService = inject(BladeService);
  private readonly router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly isCalendarSelected = signal(false);
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

  dataSource = new MatTableDataSource<ResourcePaginatedResponse, MatPaginator>();
  paginatedResult = new PaginatedResult<ResourcePaginatedResponse>();

  constructor() {
    // Mientras no haya un calendario seleccionado, no se cargan los recursos.
    effect(() => {
      if (this.calendarSelectorIdStateService.state()) {
        this.isCalendarSelected.set(true);
        this.loadResources();
      }
    });

    this.setBreadcrumb();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  handleCreateResource(): void {
    this.bladeService.show(ResourceCreateBladeComponent);

    this.bladeService.result.pipe(take(1)).subscribe({
      next: (result) => {
        if (result) {
          this.bladeService.hide();
        }
      },
    });
  }

  handleClickDetails(resourceId: string): void {
    const url = UrlUtils.buildSiteUrl(SiteUrls.resources.details, { id: resourceId });
    this.router.navigateByUrl(url);
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.paginatedResult = this.paginatedResult.handlePageEvent(pageEvent);
    this.loadResources();
  }

  handleFilterChange(paginatedResult: PaginatedResult<ResourcePaginatedResponse>): void {
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
          this.paginatedResult = PaginatedResult.create<ResourcePaginatedResponse>(response);
          this.dataSource.data = this.paginatedResult.items;

          if (this.sort && this.paginatedResult.order) {
            this.sort.active = this.paginatedResult.order.propertyName;
            this.sort.direction = this.paginatedResult.order.orderType.toLowerCase() as SortDirection;
          }
        },
      });
  }
}
