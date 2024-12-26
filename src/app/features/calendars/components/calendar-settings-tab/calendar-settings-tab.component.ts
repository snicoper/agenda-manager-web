import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { finalize, take } from 'rxjs';
import { logError } from '../../../../core/errors/debug-logger';
import { CalendarSettingsResponse } from '../../interfaces/responses/calendar-settings.response';
import { CalendarApiService } from '../../services/api/calendar-api.service';
import { CalendarDetailsService } from '../../services/calendar-details.service';
import { ResourceScheduleValidationOptions } from '../../../../shared/modules/calendar-settings/constants/resource-schedule-validation.const';

@Component({
  selector: 'am-calendar-settings-tab',
  imports: [CommonModule],
  templateUrl: './calendar-settings-tab.component.html',
  styleUrl: './calendar-settings-tab.component.scss',
})
export class CalendarSettingsTabComponent {
  private readonly apiService = inject(CalendarApiService);
  private readonly calendarDetailsService = inject(CalendarDetailsService);

  settings!: CalendarSettingsResponse;
  loading = true;

  resourceScheduleValidationOptions = ResourceScheduleValidationOptions;

  constructor() {
    this.loadSettings();
  }

  private loadSettings(): void {
    if (!this.calendarDetailsService.state.calendarId()) {
      logError('CalendarSettingsTabComponent.loadSettings', 'Calendar ID is not set');

      return;
    }

    this.loading = true;

    this.apiService
      .getCalendarSettings(this.calendarDetailsService.state.calendarId()!)
      .pipe(
        take(1),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: (settings) => (this.settings = settings),
      });
  }
}
