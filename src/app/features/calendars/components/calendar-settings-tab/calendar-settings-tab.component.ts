import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { AppointmentConfirmationRequirementUtils } from '../../../../shared/modules/calendar-settings/constants/appointment-confirmation-requirement.const';
import { AppointmentOverlappingUtils } from '../../../../shared/modules/calendar-settings/constants/appointment-overlapping-strategy.const';
import { HolidayConflictUtils } from '../../../../shared/modules/calendar-settings/constants/holiday-conflict-strategy.const';
import { ResourceScheduleValidationUtils } from '../../../../shared/modules/calendar-settings/constants/resource-schedule-validation.const';
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

      this.appointmentConfirmationRequirementValue = AppointmentConfirmationRequirementUtils.getDescriptionByType(
        this.settingsState.settings()?.confirmationRequirement ?? 1,
      );
      this.appointmentOverlappingValue = AppointmentOverlappingUtils.getDescriptionByType(
        this.settingsState.settings()?.overlapBehavior ?? 1,
      );
      this.holidayConflictValue = HolidayConflictUtils.getDescriptionByType(
        this.settingsState.settings()?.holidayAppointmentHandling ?? 1,
      );
      this.resourceScheduleValidationValue = ResourceScheduleValidationUtils.getDescriptionByType(
        this.settingsState.settings()?.scheduleValidation ?? 1,
      );
    });
  }
}
