import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormState } from '../../../../../core/forms/models/form-state.model';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';

/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-textarea',
  templateUrl: './form-textarea.component.html',
  styleUrl: './form-textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextareaComponent),
      multi: true,
    },
  ],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, TextFieldModule, FieldErrorComponent],
})
export class FormTextareaComponent implements ControlValueAccessor {
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();
  readonly = input(false);
  placeholder = input('');
  rows = input(10);

  value = '';
  isDisabled = false;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `textarea-field-${(FormTextareaComponent.nextId += 1)}`;

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
