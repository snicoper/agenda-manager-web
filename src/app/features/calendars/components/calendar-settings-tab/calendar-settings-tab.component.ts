import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { take } from 'rxjs';
import { AppointmentConfirmationRequirementUtils } from '../../../../core/modules/calendar-settings/appointment-confirmation-requirement/appointment-confirmation-requirement.const';
import { AppointmentOverlappingUtils } from '../../../../core/modules/calendar-settings/appointment-overlapping/appointment-overlapping-strategy.const';
import { HolidayConflictUtils } from '../../../../core/modules/calendar-settings/holiday-conflict/holiday-conflict-strategy.const';
import { ResourceScheduleValidationUtils } from '../../../../core/modules/calendar-settings/resource-schedule-validation/resource-schedule-validation.const';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { WorkingDaysWeekComponent } from '../../../../shared/components/calendars/working-days-week/working-days-week.component';
import { CalendarAvailableDaysRequest } from '../../models/requests/calendar-available-days.request';
import { CalendarApiService } from '../../services/api/calendar-api.service';
import { CalendarSelectedStateService } from '../../services/state/calendar-selected-state.service';
import { CalendarSettingsSelectedStateService } from '../../services/state/calendar-settings-selected-state.service';
import { CalendarSettingsUpdateBladeComponent } from '../calendar-settings-update-blade/calendar-settings-update-blade.component';

@Component({
  selector: 'am-calendar-settings-tab',
  imports: [MatProgressSpinnerModule, MatIconModule, MatButtonModule, WorkingDaysWeekComponent],
  templateUrl: './calendar-settings-tab.component.html',
  styleUrl: './calendar-settings-tab.component.scss',
})
export class CalendarSettingsTabComponent {
  private readonly apiService = inject(CalendarApiService);
  private readonly calendarSelectedStateService = inject(CalendarSelectedStateService);
  private readonly calendarSettingsSelectedStateService = inject(CalendarSettingsSelectedStateService);
  private readonly bladeService = inject(BladeService);
  private readonly snackBarService = inject(SnackBarService);

  readonly calendarState = this.calendarSelectedStateService.state;
  readonly settingsState = this.calendarSettingsSelectedStateService.state;

  // Estado inicial de las citas al ser creadas.
  appointmentConfirmationRequirementValue = '';
  // Gestión de conflictos al crear o modificar citas.
  appointmentOverlappingValue = '';
  // Gestión de conflictos al crear días festivos con solapamiento con las citas existentes.
  holidayConflictValue = '';
  // Validación de horarios de disponibilidad de los recursos requeridos al crear una cita.
  resourceScheduleValidationValue = '';

  constructor() {
    this.calendarSettingsSelectedStateService.load();
    this.loadListeners();
  }

  handleOpenUpdateCalendarSettingsBlade(): void {
    this.bladeService.open(CalendarSettingsUpdateBladeComponent);
  }

  handleWorkingDaysChange(value: number): void {
    const request: CalendarAvailableDaysRequest = {
      availableDays: value,
    };

    this.apiService
      .updateAvailableDays(this.calendarState.calendarId()!, request)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.calendarSelectedStateService.refresh();
          this.snackBarService.success('Días laborables actualizados correctamente.');
        },
        error: () => {
          this.snackBarService.error('Error al actualizar los días laborables.');
        },
      });
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
