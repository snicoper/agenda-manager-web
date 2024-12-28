import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, take } from 'rxjs';
import { FormState } from '../../../../core/forms/interfaces/form-state.interface';
import { AppointmentConfirmationRequirementStrategy } from '../../../../core/modules/calendar-settings/appointment-confirmation-requirement/appointment-confirmation-requirement-strategy.enum';
import { AppointmentOverlappingStrategy } from '../../../../core/modules/calendar-settings/appointment-overlapping/appointment-overlapping-strategy.enum';
import { HolidayConflictStrategy } from '../../../../core/modules/calendar-settings/holiday-conflict/holiday-conflict-strategy.enum';
import { ResourceScheduleValidationStrategy } from '../../../../core/modules/calendar-settings/resource-schedule-validation/resource-schedule-validation-strategy.enum';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { HttpErrorResponseMappingUtils } from '../../../../core/utils/http/http-error-response-mapping.utils';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormCalendarSettingsComponent } from '../../../../shared/components/forms/inputs/form-calendar-settings/form-calendar-settings.component';
import { FormCalendarSettingsField } from '../../../../shared/components/forms/inputs/form-calendar-settings/interfaces/form-calendar-settings-field.interface';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { FormTimeZoneSelectorComponent } from '../../../../shared/components/forms/inputs/selectors/form-time-zone-selector/form-time-zone-selector.component';
import { CalendarUpdateSettingsRequest } from '../../interfaces/requests/calendar-update-settings.request';
import { CalendarApiService } from '../../services/api/calendar-api.service';
import { CalendarSettingsStateService } from '../../services/calendar-settings-state.service';

@Component({
  selector: 'am-calendar-settings-update-blade',
  imports: [
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    FormCalendarSettingsComponent,
    FormTimeZoneSelectorComponent,
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './calendar-settings-update-blade.component.html',
  styleUrl: './calendar-settings-update-blade.component.scss',
})
export class CalendarSettingsUpdateBladeComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(CalendarApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly bladeService = inject(BladeService);
  private readonly calendarSettingsStateService = inject(CalendarSettingsStateService);

  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };
  readonly formInputTypes = FormInputType;
  readonly calendarSettingsState = this.calendarSettingsStateService.state;

  constructor() {
    this.loadListeners();
  }

  ngOnInit(): void {
    this.loadCalendarSettings();
  }

  ngOnDestroy(): void {
    this.bladeService.hide();
  }

  handleCloseBlade(): void {
    this.bladeService.emitResult(false);
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    this.formState.isLoading = true;

    const request: CalendarUpdateSettingsRequest = {
      calendarId: this.calendarSettingsState.calendarId()!,
      timeZone: this.formState.form.value.timeZone,
      appointmentConfirmationRequirement: this.formState.form.value.settings.appointmentConfirmationRequirement,
      appointmentOverlapping: this.formState.form.value.settings.appointmentOverlapping,
      holidayConflict: this.formState.form.value.settings.holidayConflict,
      resourceScheduleValidation: this.formState.form.value.settings.resourceScheduleValidation,
    };

    this.update(request);
  }

  private loadCalendarSettings(): void {
    this.calendarSettingsStateService.refresh();
  }

  private loadListeners(): void {
    this.formState.isLoading = true;
    effect(() => {
      if (!this.calendarSettingsState.settings()) {
        return;
      }

      this.buildForm();
    });
  }

  private buildForm(): void {
    const timeZoneValue: string = this.calendarSettingsState.settings()?.timeZone as string;
    const settingsValue: FormCalendarSettingsField = this.getSettingsValue();

    this.formState.form = this.formBuilder.group({
      timeZone: [timeZoneValue, [Validators.required]],
      settings: [settingsValue],
    });

    this.formState.isLoading = false;
  }

  private getSettingsValue(): FormCalendarSettingsField {
    const settingsValue: FormCalendarSettingsField = {
      appointmentConfirmationRequirement: this.calendarSettingsState.settings()
        ?.appointmentConfirmationRequirement as AppointmentConfirmationRequirementStrategy,
      appointmentOverlapping: this.calendarSettingsState.settings()
        ?.appointmentOverlapping as AppointmentOverlappingStrategy,
      holidayConflict: this.calendarSettingsState.settings()?.holidayConflict as HolidayConflictStrategy,
      resourceScheduleValidation: this.calendarSettingsState.settings()
        ?.resourceScheduleValidation as ResourceScheduleValidationStrategy,
    };

    return settingsValue;
  }

  private update(request: CalendarUpdateSettingsRequest): void {
    this.apiService
      .updateCalendarSettings(this.calendarSettingsState.calendarId()!, request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Configuración de calendario actualizada con éxito');
          this.calendarSettingsStateService.refresh();
          this.bladeService.emitResult(true);
        },
        error: (error) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }
}
