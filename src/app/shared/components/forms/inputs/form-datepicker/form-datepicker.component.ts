import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateTime } from 'luxon';
import { FormState } from '../../../../../core/models/form-state';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormInputType } from '../../models/form-input.type';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-datepicker',
  templateUrl: './form-datepicker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDatepickerComponent),
      multi: true,
    },
  ],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, FieldErrorComponent],
})
export class FormDatepickerComponent implements ControlValueAccessor {
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();
  id = input(Math.random().toString());
  formInputType = input(FormInputType.Text);
  readonly = input(false);
  placeholder = input('');

  value?: DateTime;
  isDisabled = false;

  onChange = (_: DateTime): void => {};

  onTouch = (): void => {};

  writeValue(value: DateTime): void {
    if (value !== this.value) {
      this.value = value || undefined;
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
    this.onChange(value);
  }
}
