import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormState } from '../../../../../core/forms/models/form-state.model';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormInputType } from '../form-input/types/form-input.type';
import { FormPhoneNumberField } from './models/form-phone-number-field.interface';

/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-phone-number',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIcon, FieldErrorComponent],
  templateUrl: './form-phone-number.component.html',
  styleUrl: './form-phone-number.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormPhoneNumberComponent),
      multi: true,
    },
  ],
})
export class FormPhoneNumberComponent implements ControlValueAccessor {
  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly readonly = input(false);
  readonly showIcons = input(false);
  readonly placeholder = input('');

  readonly value = signal<FormPhoneNumberField>({} as FormPhoneNumberField);
  readonly isDisabled = signal(false);
  readonly formInputTypes = FormInputType;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `phone-field-${(FormPhoneNumberComponent.nextId += 1)}`;

  onChange = (_: FormPhoneNumberField): void => {};
  onTouch = (): void => {};

  writeValue(value: FormPhoneNumberField): void {
    this.value.set(value ?? ({} as FormPhoneNumberField));
  }

  registerOnChange(fn: (value: FormPhoneNumberField) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onChangeValue(value: FormPhoneNumberField): void {
    this.onChange(value);
    this.onTouch();
  }
}
