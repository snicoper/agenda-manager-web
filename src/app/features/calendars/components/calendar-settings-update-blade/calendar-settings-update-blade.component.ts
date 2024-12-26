import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormState } from '../../../../core/modules/forms/interfaces/form-state.interface';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormCalendarSettingsComponent } from '../../../../shared/components/forms/inputs/form-calendar-settings/form-calendar-settings.component';
import { FormCalendarSettingsField } from '../../../../shared/components/forms/inputs/form-calendar-settings/interfaces/form-calendar-settings-field.interface';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { FormTimeZoneSelectorComponent } from '../../../../shared/components/forms/inputs/selectors/form-time-zone-selector/form-time-zone-selector.component';
import { AppointmentConfirmationRequirementStrategy } from '../../../../shared/modules/calendar-settings/enums/appointment-confirmation-requirement-strategy.enum';
import { AppointmentOverlappingStrategy } from '../../../../shared/modules/calendar-settings/enums/appointment-overlapping-strategy.enum';
import { HolidayConflictStrategy } from '../../../../shared/modules/calendar-settings/enums/holiday-conflict-strategy.enum';
import { ResourceScheduleValidationStrategy } from '../../../../shared/modules/calendar-settings/enums/resource-schedule-validation-strategy.enum';
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
      confirmationRequirement: this.calendarSettingsState.settings()
        ?.confirmationRequirement as AppointmentConfirmationRequirementStrategy,
      overlapBehavior: this.calendarSettingsState.settings()?.overlapBehavior as AppointmentOverlappingStrategy,
      holidayAppointmentHandling: this.calendarSettingsState.settings()
        ?.holidayAppointmentHandling as HolidayConflictStrategy,
      scheduleValidation: this.calendarSettingsState.settings()
        ?.scheduleValidation as ResourceScheduleValidationStrategy,
    };

    return settingsValue;
  }
}
