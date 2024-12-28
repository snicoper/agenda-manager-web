import { Component, forwardRef, input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormState } from '../../../../../core/forms/interfaces/form-state.interface';
import { AppointmentConfirmationRequirementUtils } from '../../../../../core/modules/calendar-settings/appointment-confirmation-requirement/appointment-confirmation-requirement.const';
import { AppointmentOverlappingUtils } from '../../../../../core/modules/calendar-settings/appointment-overlapping/appointment-overlapping-strategy.const';
import { ResourceScheduleValidationUtils } from '../../../../../core/modules/calendar-settings/resource-schedule-validation/resource-schedule-validation.const';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormInputType } from '../form-input/types/form-input.type';
import { FormCalendarSettingsField } from './interfaces/form-calendar-settings-field.interface';
import { FormCalendarSettingsPlaceholders } from './interfaces/form-calendar-settings-placeholders.interface';
import { HolidayConflictUtils } from '../../../../../core/modules/calendar-settings/holiday-conflict/holiday-conflict-strategy.const';

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
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();
  readonly = input(false);
  showIcons = input(false);
  placeholders = input<FormCalendarSettingsPlaceholders>();

  readonly formInputTypes = FormInputType;

  /** Opciones de los selects.  */
  readonly appointmentConfirmationRequirementUtils = AppointmentConfirmationRequirementUtils;
  readonly appointmentOverlappingUtils = AppointmentOverlappingUtils;
  readonly holidayConflictUtils = HolidayConflictUtils;
  readonly resourceScheduleValidationUtils = ResourceScheduleValidationUtils;

  value!: FormCalendarSettingsField;
  isDisabled = false;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `address-field-${(FormCalendarSettingsComponent.nextId += 1)}`;

  onChange = (_: FormCalendarSettingsField): void => {};
  onTouch = (): void => {};

  ngOnInit(): void {
    this.loadCalendarSettings();
  }

  writeValue(value: FormCalendarSettingsField): void {
    this.value = value || ({} as FormCalendarSettingsField);
  }

  registerOnChange(fn: (value: FormCalendarSettingsField) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: FormCalendarSettingsField): void {
    this.onChange(value);
    this.onTouch();
  }

  private loadCalendarSettings(): void {}
}
