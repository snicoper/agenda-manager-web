import { Component, inject } from '@angular/core';
import { ResourceScheduleResponse } from '../../models/responses/resource-schedule.response';
import { ResourceApiService } from '../../services/api/resource-api.service';
import { ResourceSelectedStateService } from '../../services/state/resource-selected-state.service';

@Component({
  selector: 'am-resource-schedules-tab',
  imports: [],
  templateUrl: './resource-schedules-tab.component.html',
  styleUrl: './resource-schedules-tab.component.scss',
})
export class ResourceSchedulesTabComponent {
  private readonly apiService = inject(ResourceApiService);
  private readonly resourceSelectedStateService = inject(ResourceSelectedStateService);

  constructor() {
    this.loadSchedules();
  }

  private loadSchedules(): void {
    this.apiService
      .getSchedulesByResourceId(this.resourceSelectedStateService.state.resourceId()!)
      .subscribe((schedules: ResourceScheduleResponse[]) => {});
  }
}
