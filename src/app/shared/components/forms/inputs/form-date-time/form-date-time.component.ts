/* eslint-disable  @typescript-eslint/no-empty-function */
import { Component, computed, effect, forwardRef, input, signal } from '@angular/core';
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
  // Inputs.
  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly labelDate = input<string>('Start date');
  readonly labelTime = input<string>('Start time');
  readonly placeholderDate = input('');
  readonly placeholderTime = input('');
  readonly readonly = input(false);
  readonly icon = input('');
  readonly formIconPosition = input(FormIconPosition.prefix);
  readonly intervalTime = input('30min');

  // Internal state.
  readonly isDisabled = signal(false);

  private readonly date$ = signal<DateTime>(DateTime.local());
  private readonly time$ = signal<DateTime>(DateTime.local());

  // Computed values.
  readonly date = computed(() => this.date$());
  readonly time = computed(() => this.time$());
  readonly combinedDateTime = computed(() => this.getCombinedDateTime());

  // Constants and IDs.
  readonly iconPositions = FormIconPosition;
  private static nextId = 0;
  readonly id = `input-field-${(FormDateTimeComponent.nextId += 1)}`;

  constructor() {
    effect(() => {
      const dateTime = this.combinedDateTime();
      this.onChange(dateTime);
      this.onTouch();
    });
  }

  // Control Value Accessor callbacks.
  private onChange: (value: DateTime) => void = () => {};
  private onTouch: () => void = () => {};

  private getCombinedDateTime(): DateTime {
    const currentDate = this.date$();
    const currentTime = this.time$();

    return currentDate.set({
      hour: currentTime.hour,
      minute: currentTime.minute,
      second: 0,
      millisecond: 0,
    });
  }

  writeValue(value: DateTime): void {
    if (!value) {
      value = DateTime.local();
    }

    this.date$.set(value);
    this.time$.set(value);
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

  // Event Handlers.
  handleDateChange(date: DateTime): void {
    this.date$.set(date);
  }

  handleTimeChange(time: DateTime): void {
    this.time$.set(time);
  }
}
