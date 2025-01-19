/* eslint-disable  @typescript-eslint/no-empty-function */
import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormState } from '../../../../../core/forms/models/form-state.model';
import { WeekDays } from '../../../../../core/modules/week-days/week-days.const';
import { WeekDay } from '../../../../../core/modules/week-days/week-days.type';
import { WeekDaysUtils } from '../../../../../core/modules/week-days/week-days.utils';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';

@Component({
  selector: 'am-form-working-days-week',
  imports: [MatFormFieldModule, MatChipsModule, FieldErrorComponent],
  templateUrl: './form-working-days-week.component.html',
  styleUrl: './form-working-days-week.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormWorkingDaysWeekComponent),
      multi: true,
    },
  ],
})
export class FormWorkingDaysWeekComponent implements ControlValueAccessor {
  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly helpText = input<string>('');

  readonly value = signal<number>(WeekDays.None);
  readonly isDisabled = signal(false);

  private static nextId = 0;
  id = `form-working-days-week-${(FormWorkingDaysWeekComponent.nextId += 1)}`;

  protected readonly days = computed(() => {
    return Object.entries(WeekDays)
      .filter(([key]) => key !== 'None')
      .map(([key, value]) => ({
        name: key,
        value: value as WeekDay,
        selected: WeekDaysUtils.hasFlag(this.value(), value as WeekDay),
      }));
  });

  protected handleSelectionChange(event: MatChipListboxChange): void {
    const selectedDayNames = event.value as string[];

    if (!selectedDayNames?.length) {
      this.onChangeValue(WeekDays.None);

      return;
    }

    const newValue = selectedDayNames.reduce((acc, dayName) => {
      const dayValue = WeekDays[dayName as keyof typeof WeekDays];

      return acc | dayValue;
    }, 0);

    this.onChangeValue(newValue);
  }

  onChange = (_: number): void => {};

  onTouch = (): void => {};

  writeValue(value: number): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onChangeValue(value: number): void {
    this.onChange(value);
    this.onTouch();
  }
}
