/* eslint-disable  @typescript-eslint/no-empty-function */
import { Component, forwardRef, input, signal } from '@angular/core';
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
  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly labelDate = input<string>('Fecha de inicio');
  readonly labelTime = input<string>('Hora de inicio');
  readonly placeholderDate = input('');
  readonly placeholderTime = input('');
  readonly readonly = input(false);
  readonly icon = input('');
  readonly formIconPosition = input(FormIconPosition.prefix);
  readonly intervalTime = input('30min');

  readonly value = signal(DateTime.local());
  readonly isDisabled = signal(false);

  readonly iconPositions = FormIconPosition;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `input-field-${(FormDateTimeComponent.nextId += 1)}`;

  onChange = (_: DateTime): void => {};

  onTouch = (): void => {};

  writeValue(value: DateTime): void {
    this.value.set(value ?? DateTime.local());
  }

  registerOnChange(fn: (value: DateTime) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onChangeValue(value: DateTime): void {
    this.onChange(value);
    this.onTouch();
  }
}
