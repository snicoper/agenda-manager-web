import { Component, forwardRef, input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateTime } from 'luxon';
import { FormState } from '../../../../../core/models/form-state.interface';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-datetime-picker',
  templateUrl: './form-datetime-picker.component.html',
  styleUrl: './form-datetime-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDatetimePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormDatetimePickerComponent),
      multi: true,
    },
  ],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, FieldErrorComponent],
})
export class FormDatetimePickerComponent implements ControlValueAccessor, Validator {
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();
  readonly = input(false);
  placeholder = input('');

  value?: DateTime;
  isDisabled = false;

  hourValue!: string;
  minutesValue!: string;

  patternFieldHour = /^([0-1]?\d|2[0-3])$/;
  patternFieldMinutes = /^([0-5]\d)$/;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `date-time-field-${(FormDatetimePickerComponent.nextId += 1)}`;

  onChange = (_: DateTime): void => {};

  onTouch = (): void => {};

  writeValue(value: DateTime): void {
    if (value !== this.value) {
      this.value = value || undefined;

      // Setear hora y minutos.
      if (this.value) {
        this.hourValue = this.padValue(String(this.value.hour));
        this.minutesValue = this.padValue(String(this.value.minute));
      }

      this.onChange(this.value);
    } else {
      this.value = undefined;
    }
  }

  registerOnChange(fn: (value: DateTime) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: DateTime): void {
    this.value = value;
    this.onTouch();
    this.handleChangeDateTime();
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if ((control.enabled && !this.value?.isValid) || !this.isValidTime()) {
      control.setErrors({ invalidDateTime: true });

      return { invalidDateTime: true };
    }

    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    // Nothing.
  }

  handleChangeDateTime(): void {
    this.hourValue = this.padValue(this.hourValue);
    this.minutesValue = this.padValue(this.minutesValue);

    if (!this.value?.isValid || !this.isValidTime()) {
      const control = this.formState().form.get(this.fieldName()) as AbstractControl;
      this.validate(control);

      return;
    }

    const hour = parseInt(this.hourValue);
    const minutes = parseInt(this.minutesValue);

    this.value = this.value?.set({ hour: hour, minute: minutes });

    if (this.value?.isValid) {
      this.onChange(this.value);
    }
  }

  /** Obtener 2 dígitos como string. */
  private padValue(value: string): string {
    if (parseInt(value) < 10 && value.length < 2) {
      return `0${value}`;
    }

    return value;
  }

  private isValidTime(): boolean {
    const validHour = this.patternFieldHour.exec(this.hourValue);
    const validMinutes = this.patternFieldMinutes.exec(this.minutesValue);

    return !!(validHour && validMinutes);
  }
}
