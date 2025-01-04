import { Component, forwardRef, input, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormState } from '../../../../../core/forms/models/form-state.model';
import { AppointmentConfirmationRequirementUtils } from '../../../../../core/modules/calendar-settings/appointment-confirmation-requirement/appointment-confirmation-requirement.const';
import { AppointmentOverlappingUtils } from '../../../../../core/modules/calendar-settings/appointment-overlapping/appointment-overlapping-strategy.const';
import { HolidayConflictUtils } from '../../../../../core/modules/calendar-settings/holiday-conflict/holiday-conflict-strategy.const';
import { ResourceScheduleValidationUtils } from '../../../../../core/modules/calendar-settings/resource-schedule-validation/resource-schedule-validation.const';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormInputType } from '../form-input/types/form-input.type';
import { FormCalendarSettingsField } from './models/form-calendar-settings-field.interface';
import { FormCalendarSettingsPlaceholders } from './models/form-calendar-settings-placeholders.interface';

/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-calendar-settings',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIcon, FieldErrorComponent],
  templateUrl: './form-calendar-settings.component.html',
  styleUrl: './form-calendar-settings.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCalendarSettingsComponent),
      multi: true,
    },
  ],
})
export class FormCalendarSettingsComponent implements ControlValueAccessor, OnInit {
  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly readonly = input(false);
  readonly showIcons = input(false);
  readonly placeholders = input<FormCalendarSettingsPlaceholders>();

  readonly value = signal({} as FormCalendarSettingsField);
  readonly isDisabled = signal(false);
  readonly formInputTypes = FormInputType;

  /** Opciones de los selects.  */
  readonly appointmentConfirmationRequirementUtils = AppointmentConfirmationRequirementUtils;
  readonly appointmentOverlappingUtils = AppointmentOverlappingUtils;
  readonly holidayConflictUtils = HolidayConflictUtils;
  readonly resourceScheduleValidationUtils = ResourceScheduleValidationUtils;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `address-field-${(FormCalendarSettingsComponent.nextId += 1)}`;

  onChange = (_: FormCalendarSettingsField): void => {};
  onTouch = (): void => {};

  ngOnInit(): void {
    this.loadCalendarSettings();
  }

  writeValue(value: FormCalendarSettingsField): void {
    this.value.set(value ?? ({} as FormCalendarSettingsField));
  }

  registerOnChange(fn: (value: FormCalendarSettingsField) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onChangeValue(value: FormCalendarSettingsField): void {
    this.onChange(value);
    this.onTouch();
  }

  private loadCalendarSettings(): void {}
}
