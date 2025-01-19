import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { finalize, take } from 'rxjs';
import { SystemPermissions } from '../../../../core/modules/auth/constants/system-permissions.const';
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { TableFilterComponent } from '../../../../shared/components/tables/table-filter/table-filter.component';
import { RequiredPermissionDirective } from '../../../../shared/directives/required-permission.directive';
import { BoolToIconPipe } from '../../../../shared/pipes/bool-to-icon.pipe';
import { DateTimeFormatPipe } from '../../../../shared/pipes/date-time-format.pipe';
import { ResourceScheduleResponse } from '../../models/responses/resource-schedule.response';
import { ResourceApiService } from '../../services/api/resource-api.service';
import { ResourceSelectedStateService } from '../../services/state/resource-selected-state.service';
import { ScheduleCreateBladeComponent } from '../schedule-create-blade/schedule-create-blade.component';

@Component({
  selector: 'am-resource-schedules-tab',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    TableFilterComponent,
    PaginatorComponent,
    BoolToIconPipe,
    DateTimeFormatPipe,
    RequiredPermissionDirective,
  ],
  templateUrl: './resource-schedules-tab.component.html',
  styleUrl: './resource-schedules-tab.component.scss',
})
export class ResourceSchedulesTabComponent implements AfterViewInit {
  private readonly apiService = inject(ResourceApiService);
  private readonly resourceSelectedStateService = inject(ResourceSelectedStateService);
  private readonly bladeService = inject(BladeService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly isLoading = signal(false);

  readonly displayedColumns = ['name', 'description', 'start', 'end', 'type', 'availableDays', 'isActive'];
  readonly fieldsFilter = ['name', 'description'];
  readonly systemPermissions = SystemPermissions;

  dataSource = new MatTableDataSource<ResourceScheduleResponse, MatPaginator>();
  paginatedResult = new PaginatedResult<ResourceScheduleResponse>();

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.loadSchedules();
    }, 0);
  }

  handleCreateSchedule(): void {
    this.bladeService.open(ScheduleCreateBladeComponent);

    this.bladeService.result.subscribe((result) => {
      if (result) {
        this.loadSchedules();
      }
    });
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.paginatedResult = this.paginatedResult.handlePageEvent(pageEvent);
    this.loadSchedules();
  }

  handleFilterChange(paginatedResult: PaginatedResult<ResourceScheduleResponse>): void {
    this.paginatedResult = paginatedResult;
    this.loadSchedules();
  }

  handleSortChange(sortState: Sort): void {
    this.paginatedResult.handleSortChange(sortState);
    this.loadSchedules();
  }

  private loadSchedules(): void {
    this.isLoading.set(true);

    this.apiService
      .getSchedulesByResourceIdPaginated(this.resourceSelectedStateService.state.resourceId()!, this.paginatedResult)
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.paginatedResult = PaginatedResult.create<ResourceScheduleResponse>(response);
          this.dataSource.data = this.paginatedResult.items;

          if (this.sort && this.paginatedResult.order) {
            this.sort.active = this.paginatedResult.order.propertyName;
            this.sort.direction = this.paginatedResult.order.orderType.toLowerCase() as SortDirection;
          }
        },
      });
  }
}
