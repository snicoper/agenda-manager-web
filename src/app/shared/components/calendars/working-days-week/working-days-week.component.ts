import { Component, computed, input, output } from '@angular/core';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { WeekDays } from '../../../../core/modules/week-days/week-days.const';
import { WeekDay } from '../../../../core/modules/week-days/week-days.type';
import { WeekDaysUtils } from '../../../../core/modules/week-days/week-days.utils';

@Component({
  selector: 'am-working-days-week',
  imports: [MatChipsModule],
  templateUrl: './working-days-week.component.html',
  styleUrl: './working-days-week.component.scss',
})
export class WorkingDaysWeekComponent {
  readonly value = input<number>(WeekDays.None);
  readonly title = input<string>('Días laborables');
  readonly helpText = input<string>('');

  readonly valueChange = output<number>();

  protected readonly days = computed(() => {
    return Object.entries(WeekDays)
      .filter(([key]) => key !== 'None')
      .map(([key, value]) => ({
        name: key,
        value: value as WeekDay,
        selected: WeekDaysUtils.hasFlag(this.value(), value as WeekDay),
      }));
  });

  protected onSelectionChange(event: MatChipListboxChange): void {
    const selectedDayNames = event.value as string[];

    if (!selectedDayNames?.length) {
      this.valueChange.emit(WeekDays.None);

      return;
    }

    // Convertir los nombres de los días a sus valores numéricos y combinarlos.
    const newValue = selectedDayNames.reduce((acc, dayName) => {
      const dayValue = WeekDays[dayName as keyof typeof WeekDays];

      return acc | dayValue;
    }, 0);

    this.valueChange.emit(newValue);
  }
}
