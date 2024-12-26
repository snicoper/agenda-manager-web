import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { CalendarSettingsStateService } from '../../services/calendar-settings-state.service';
import { CalendarSettingsUpdateBladeComponent } from '../calendar-settings-update-blade/calendar-settings-update-blade.component';

@Component({
  selector: 'am-calendar-settings-tab',
  imports: [MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './calendar-settings-tab.component.html',
  styleUrl: './calendar-settings-tab.component.scss',
})
export class CalendarSettingsTabComponent {
  private readonly calendarSettingsStateService = inject(CalendarSettingsStateService);
  private readonly bladeService = inject(BladeService);

  readonly settingsState = this.calendarSettingsStateService.state;

  constructor() {
    this.calendarSettingsStateService.load();
  }

  handleOpenUpdateCalendarSettingsBlade(): void {
    this.bladeService.show(CalendarSettingsUpdateBladeComponent);
  }
}
