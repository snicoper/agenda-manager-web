import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { finalize, take } from 'rxjs';
import { SystemPermissions } from '../../../../core/modules/auth/constants/system-permissions.const';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { RequiredPermissionDirective } from '../../../../shared/directives/required-permission.directive';
import { ResourceScheduleResponse } from '../../models/responses/resource-schedule.response';
import { ResourceApiService } from '../../services/api/resource-api.service';
import { ResourceSelectedStateService } from '../../services/state/resource-selected-state.service';
import { ScheduleCreateBladeComponent } from '../schedule-create-blade/schedule-create-blade.component';

@Component({
  selector: 'am-resource-schedules-tab',
  imports: [MatButtonModule, MatIconModule, RequiredPermissionDirective],
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
    this.bladeService.open(ScheduleCreateBladeComponent);

    this.bladeService.result.subscribe((result) => {
      if (result) {
        this.loadSchedules();
      }
    });
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
