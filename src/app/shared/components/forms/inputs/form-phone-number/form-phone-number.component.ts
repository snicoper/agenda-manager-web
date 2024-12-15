import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormState } from '../../../../../core/models/form-state';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormInputType } from '../../models/form-input.type';
import { FormPhoneNumber } from '../../models/form-phone-number.interface';

/* eslint-disable  @typescript-eslint/no-unused-vars */
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
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();
  readonly = input(false);
  showIcons = input(false);
  placeholder = input('');

  readonly formInputTypes = FormInputType;

  value = {} as FormPhoneNumber;
  isDisabled = false;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `phone-field-${(FormPhoneNumberComponent.nextId += 1)}`;

  onChange = (_: FormPhoneNumber): void => {};
  onTouch = (): void => {};

  writeValue(value: FormPhoneNumber): void {
    this.value = value || ({} as FormPhoneNumber);
  }

  registerOnChange(fn: (value: FormPhoneNumber) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: FormPhoneNumber): void {
    this.onChange(value);
  }
}
