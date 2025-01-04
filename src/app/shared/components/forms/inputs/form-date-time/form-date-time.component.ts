/* eslint-disable  @typescript-eslint/no-empty-function */
import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { DateTime } from 'luxon';
import { FormState } from '../../../../../core/forms/models/form-state.model';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormIconPosition } from '../../types/form-icon-position.enum';

@Component({
  selector: 'am-form-date-time',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FieldErrorComponent,
  ],
  templateUrl: './form-date-time.component.html',
  styleUrl: './form-date-time.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDateTimeComponent),
      multi: true,
    },
  ],
})
export class FormDateTimeComponent implements ControlValueAccessor {
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  labelDate = input<string>('Fecha de inicio');
  labelTime = input<string>('Hora de inicio');
  placeholderDate = input('');
  placeholderTime = input('');
  readonly = input(false);
  icon = input('');
  formIconPosition = input(FormIconPosition.prefix);

  readonly iconPositions = FormIconPosition;

  value = DateTime.local();
  isDisabled = false;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `input-field-${(FormDateTimeComponent.nextId += 1)}`;

  onChange = (_: DateTime): void => {};

  onTouch = (): void => {};

  writeValue(value: DateTime): void {
    this.value = value || DateTime.local();
  }

  registerOnChange(fn: (value: DateTime) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: DateTime): void {
    this.onChange(value);
    this.onTouch();
  }
}
