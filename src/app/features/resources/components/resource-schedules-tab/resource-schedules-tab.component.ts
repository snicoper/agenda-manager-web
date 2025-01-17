import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { finalize, take } from 'rxjs';
import { SystemPermissions } from '../../../../core/modules/auth/constants/system-permissions.const';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { ResourceScheduleResponse } from '../../models/responses/resource-schedule.response';
import { ResourceApiService } from '../../services/api/resource-api.service';
import { ResourceSelectedStateService } from '../../services/state/resource-selected-state.service';

@Component({
  selector: 'am-resource-schedules-tab',
  imports: [],
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

  dataSource = new MatTableDataSource<ResourceScheduleResponse>();
  schedules: ResourceScheduleResponse[] = [];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.loadSchedules();
    }, 0);
  }

  handleCreateSchedule(): void {
    // TODO: Implement handleCreateSchedule method
  }

  private loadSchedules(): void {
    this.isLoading.set(true);

    this.apiService
      .getSchedulesByResourceId(this.resourceSelectedStateService.state.resourceId()!)
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe();
  }
}
