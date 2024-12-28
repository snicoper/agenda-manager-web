import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppointmentConfirmationRequirementUtils } from '../../../../core/modules/calendar-settings/appointment-confirmation-requirement/appointment-confirmation-requirement.const';
import { AppointmentOverlappingUtils } from '../../../../core/modules/calendar-settings/appointment-overlapping/appointment-overlapping-strategy.const';
import { ResourceScheduleValidationUtils } from '../../../../core/modules/calendar-settings/resource-schedule-validation/resource-schedule-validation.const';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { CalendarSettingsStateService } from '../../services/calendar-settings-state.service';
import { CalendarSettingsUpdateBladeComponent } from '../calendar-settings-update-blade/calendar-settings-update-blade.component';
import { HolidayConflictUtils } from '../../../../core/modules/calendar-settings/holiday-conflict/holiday-conflict-strategy.const';

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

  // Estado inicial de las citas al ser creadas.
  appointmentConfirmationRequirementValue = '';
  // Gestión de conflictos al crear o modificar citas.
  appointmentOverlappingValue = '';
  // Gestión de conflictos al crear días festivos con solapamiento con las citas existentes.
  holidayConflictValue = '';
  // Validación de horarios de disponibilidad de los recursos requeridos al crear una cita.
  resourceScheduleValidationValue = '';

  constructor() {
    this.calendarSettingsStateService.load();
    this.loadListeners();
  }

  handleOpenUpdateCalendarSettingsBlade(): void {
    this.bladeService.show(CalendarSettingsUpdateBladeComponent);
  }

  private loadListeners(): void {
    effect(() => {
      if (!this.settingsState.settings()) {
        return;
      }

      this.appointmentConfirmationRequirementValue = AppointmentConfirmationRequirementUtils.getDescriptionByValue(
        this.settingsState.settings()?.appointmentConfirmationRequirement ?? 1,
      );

      this.appointmentOverlappingValue = AppointmentOverlappingUtils.getDescriptionByValue(
        this.settingsState.settings()?.appointmentOverlapping ?? 1,
      );

      this.holidayConflictValue = HolidayConflictUtils.getDescriptionByValue(
        this.settingsState.settings()?.holidayConflict ?? 1,
      );

      this.resourceScheduleValidationValue = ResourceScheduleValidationUtils.getDescriptionByValue(
        this.settingsState.settings()?.resourceScheduleValidation ?? 1,
      );
    });
  }
}
