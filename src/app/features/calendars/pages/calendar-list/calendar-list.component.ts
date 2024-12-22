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
import { SystemPermissions } from '../../../../core/auth/permissions/system-permissions.const';
import { SiteUrls } from '../../../../core/config/site-urls';
import { PaginatedResult } from '../../../../core/paginated-result/paginated-result';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { RequiredPermissionDirective } from '../../../../shared/directives/required-permission.directive';
import { BoolToIconPipe } from '../../../../shared/pipes/bool-to-icon.pipe';
import { CalendarCreateBladeComponent } from '../../components/calendar-create-blade/calendar-create-blade.component';
import { CalendarPaginatedResponse } from '../../models/calendar-paginated.response';
import { CalendarApiService } from '../../services/calendar-api.service';

@Component({
  selector: 'am-calendar-list',
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
  templateUrl: './calendar-list.component.html',
  styleUrl: './calendar-list.component.scss',
})
export class CalendarListComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly apiService = inject(CalendarApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly bladeService = inject(BladeService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly breadcrumb = new BreadcrumbCollection();
  readonly displayedColumns = ['name', 'description', 'isActive', 'actions'];
  readonly fieldsFilter = ['name', 'description'];
  readonly systemPermissions = SystemPermissions;

  dataSource = new MatTableDataSource<CalendarPaginatedResponse>();
  paginatedResult = new PaginatedResult<CalendarPaginatedResponse>();
  loading = true;

  constructor() {
    this.setBreadcrumb();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.loadCalendars();
    });
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.paginatedResult = this.paginatedResult.handlePageEvent(pageEvent);
    this.loadCalendars();
  }

  handleFilterChange(paginatedResult: PaginatedResult<CalendarPaginatedResponse>): void {
    this.paginatedResult = paginatedResult;
    this.loadCalendars();
  }

  handleSortChange(sortState: Sort): void {
    this.paginatedResult.handleSortChange(sortState);
    this.loadCalendars();
  }

  handleCreateCalendar(): void {
    this.bladeService.show(CalendarCreateBladeComponent);

    this.bladeService.result.pipe(take(1)).subscribe({
      next: (result) => {
        if (result) {
          this.loadCalendars();
        }
      },
    });
  }

  private setBreadcrumb(): void {
    this.breadcrumb.add('Calendarios', SiteUrls.calendars.list, '', false);
  }

  private loadCalendars(): void {
    this.loading = true;
    this.apiService
      .getCalendarsPaginated(this.paginatedResult)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.paginatedResult = PaginatedResult.create<CalendarPaginatedResponse>(response);
          this.dataSource.data = this.paginatedResult.items;

          if (this.sort && this.paginatedResult.order) {
            this.sort.active = this.paginatedResult.order.propertyName;
            this.sort.direction = this.paginatedResult.order.orderType.toLocaleLowerCase() as SortDirection;
          }
        },
        error: () => this.snackBarService.error('Ha ocurrido un error al cargar los calendarios.'),
      });
  }
}
