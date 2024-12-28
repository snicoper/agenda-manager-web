import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormInputType } from '../form-input/types/form-input.type';
import { FormAddressField } from './interfaces/form-address-field.interface';
import { FormAddressPlaceholders } from './interfaces/form-address-placeholders.interface';
import { FormState } from '../../../../../core/forms/interfaces/form-state.interface';

/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-address',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIcon, FieldErrorComponent],
  templateUrl: './form-address.component.html',
  styleUrl: './form-address.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormAddressComponent),
      multi: true,
    },
  ],
})
export class FormAddressComponent implements ControlValueAccessor {
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();
  readonly = input(false);
  showIcons = input(false);
  placeholders = input<FormAddressPlaceholders>();

  readonly formInputTypes = FormInputType;

  value = {} as FormAddressField;
  isDisabled = false;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `address-field-${(FormAddressComponent.nextId += 1)}`;

  onChange = (_: FormAddressField): void => {};
  onTouch = (): void => {};

  writeValue(value: FormAddressField): void {
    this.value = value || ({} as FormAddressField);
  }

  registerOnChange(fn: (value: FormAddressField) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: FormAddressField): void {
    this.onChange(value);
    this.onTouch();
  }
}
