import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormState } from '../../../../../core/models/form-state';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormIconPosition } from '../../models/form-icon-position';
import { FormInputType } from '../../models/form-input-type';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-input',
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIcon, FieldErrorComponent],
})
export class FormInputComponent implements ControlValueAccessor {
  formState = input.required<FormState>();

  fieldName = input.required<string>();
  label = input.required<string>();
  id = input(Math.random().toString());
  readonly = input(false);
  formInputType = input(FormInputType.Text);
  placeholder = input('');
  icon = input('');
  formIconPosition = input(FormIconPosition.prefix);

  iconPositions = FormIconPosition;
  value = '';
  isDisabled = false;

  onChange = (_: string): void => {};

  onTouch = (): void => {};

  writeValue(value: string): void {
    if (value !== this.value) {
      this.value = value || '';
      this.onChange(this.value);
    } else {
      this.value = '';
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

  onChangeValue(value: string): void {
    this.onChange(value);
  }
}
