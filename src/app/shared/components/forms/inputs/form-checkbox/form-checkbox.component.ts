import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormState } from '../../../../../core/interfaces/forms/form-state.interface';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';

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
  imports: [FormsModule, MatFormFieldModule, MatCheckbox, FieldErrorComponent],
})
export class FormCheckboxComponent implements ControlValueAccessor {
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();

  value = false;
  isDisabled = false;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `address-field-${(FormCheckboxComponent.nextId += 1)}`;

  onChange = (_: boolean): void => {};

  onTouch = (): void => {};

  writeValue(value: boolean): void {
    this.value = value || false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: boolean): void {
    this.onChange(value);
    this.onTouch();
  }
}
