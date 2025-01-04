import { Component, effect, input, output, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { YearSelectorComponent } from '../year-selector/year-selector.component';
import { CalendarItem } from './models/calendar-item.model';
import { DateTimeSelectedEvent } from './models/date-time-selected-event.model';
import { MonthCalendarComponent } from './month-calendar/month-calendar.component';

@Component({
  selector: 'am-year-calendar',
  imports: [MonthCalendarComponent, YearSelectorComponent],
  templateUrl: './year-calendar.component.html',
  styleUrl: './year-calendar.component.scss',
})
export class YearCalendarComponent {
  readonly year = input.required<number>();
  readonly items = input.required<CalendarItem[]>();
  readonly showYearSelector = input<boolean>(false);
  readonly loading = input<boolean>(false);

  readonly dateTimeSelected = output<DateTimeSelectedEvent>();
  readonly yearChanged = output<number>();

  readonly months = signal<DateTime[]>([]);

  constructor() {
    this.initializeMonths();
  }

  handleDateTimeSelected(dateTimeSelected: DateTimeSelectedEvent): void {
    this.dateTimeSelected.emit(dateTimeSelected);
  }

  handlerYearSelected(date: DateTime): void {
    this.yearChanged.emit(date.year);
  }

  getItemsForMonth(month: DateTime): CalendarItem[] {
    return this.items().filter((item) => {
      // Verifica si el mes está dentro del rango del período.
      const startMonth = item.period.start?.month;
      const endMonth = item.period.end?.month;

      // Si el mes está entre el inicio y el fin (inclusive), debe mostrarse.
      return startMonth <= month.month && month.month <= endMonth;
    });
  }

  getMonthKey(month: DateTime): string {
    return `${month.year}-${month.month}`;
  }

  private initializeMonths(): void {
    effect(() => {
      const startMonth = 1;
      const endMonth = 12;

      this.months.set([]);

      for (let month = startMonth; month <= endMonth; month++) {
        const monthDate = DateTime.fromObject({
          year: this.year(),
          month: month,
          day: 1,
        });

        // Verificamos que el mes se creó correctamente.
        if (monthDate.isValid) {
          this.months.update((months) => [...months, monthDate]);
        }
      }
    });
  }
}
