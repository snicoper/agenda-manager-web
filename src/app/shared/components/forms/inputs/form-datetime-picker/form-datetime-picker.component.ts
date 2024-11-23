import { Component, forwardRef, input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatHint } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateTime } from 'luxon';
import { BadRequest } from '../../../../../core/models/bad-request';
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
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatHint,
    MatButtonModule,
    FieldErrorComponent,
  ],
})
export class FormDatetimePickerComponent implements ControlValueAccessor, Validator {
  badRequest = input.required<BadRequest | undefined>();
  form = input.required<FormGroup>();
  submitted = input.required<boolean>();
  fieldName = input.required<string>();
  label = input.required<string>();
  id = input(Math.random().toString());
  readonly = input(false);
  placeholder = input('');

  value?: DateTime;
  isDisabled = false;

  hourValue!: string;
  minutesValue!: string;

  patternFieldHour = /^([0-1]?\d|2[0-3])$/;
  patternFieldMinutes = /^([0-5]\d)$/;

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

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: DateTime): void {
    this.value = value;
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
      const control = this.form().get(this.fieldName()) as AbstractControl;
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
