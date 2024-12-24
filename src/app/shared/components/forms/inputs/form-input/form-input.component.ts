import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormIconPosition } from '../../types/form-icon-position.enum';
import { FormInputType } from './types/form-input.type';
import { FormState } from '../../../../../core/modules/forms/interfaces/form-state.interface';

/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-input',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIcon, FieldErrorComponent],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor {
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();
  readonly = input(false);
  formInputType = input(FormInputType.Text);
  placeholder = input('');
  icon = input('');
  formIconPosition = input(FormIconPosition.prefix);

  iconPositions = FormIconPosition;
  value = '';
  isDisabled = false;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `input-field-${(FormInputComponent.nextId += 1)}`;

  onChange = (_: string): void => {};

  onTouch = (): void => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: string): void {
    this.onChange(value);
    this.onTouch();
  }
}
