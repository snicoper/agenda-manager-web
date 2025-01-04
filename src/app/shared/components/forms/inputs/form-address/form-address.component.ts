import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormState } from '../../../../../core/forms/models/form-state.model';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormInputType } from '../form-input/types/form-input.type';
import { FormAddressField } from './models/form-address-field.interface';
import { FormAddressPlaceholders } from './models/form-address-placeholders.interface';

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
  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly readonly = input(false);
  readonly showIcons = input(false);
  readonly placeholders = input<FormAddressPlaceholders>();

  readonly value = signal<FormAddressField>({} as FormAddressField);
  readonly isDisabled = signal(false);
  readonly formInputTypes = FormInputType;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `address-field-${(FormAddressComponent.nextId += 1)}`;

  onChange = (_: FormAddressField): void => {};
  onTouch = (): void => {};

  writeValue(value: FormAddressField): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: FormAddressField) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onChangeValue(value: FormAddressField): void {
    this.onChange(value);
    this.onTouch();
  }
}
