import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BadRequest } from '../../../../../core/models/bad-request';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCheckboxComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatCheckbox, FieldErrorComponent],
})
export class FormCheckboxComponent implements ControlValueAccessor {
  badRequest = input.required<BadRequest | undefined>();
  form = input.required<FormGroup>();
  submitted = input.required<boolean>();
  fieldName = input.required<string>();
  label = input.required<string>();
  id = input(Math.random().toString());

  value = false;
  isDisabled = false;

  onChange = (_: boolean): void => {};

  onTouch = (): void => {};

  writeValue(value: boolean): void {
    if (value !== this.value) {
      this.value = value || false;
      this.onChange(this.value);
    } else {
      this.value = false;
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

  onChangeValue(value: boolean): void {
    this.onChange(value);
  }
}
