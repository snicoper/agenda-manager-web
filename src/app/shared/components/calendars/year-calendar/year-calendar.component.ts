import { Component, effect, input, output } from '@angular/core';
import { DateTime } from 'luxon';
import { Period } from '../../../../core/models/period.model';
import { YearSelectorComponent } from '../year-selector/year-selector.component';
import { CalendarItem } from './models/calendar-event.model';
import { MonthCalendarComponent } from './month-calendar/month-calendar.component';

@Component({
  selector: 'am-year-calendar',
  imports: [MonthCalendarComponent, YearSelectorComponent],
  templateUrl: './year-calendar.component.html',
  styleUrl: './year-calendar.component.scss',
})
export class YearCalendarComponent {
  year = input.required<number>();
  items = input.required<CalendarItem[]>();
  showYearSelector = input<boolean>(false);
  loading = input<boolean>(false);

  periodSelected = output<Period>();
  yearChanged = output<number>();

  months: DateTime[] = [];

  constructor() {
    this.initializeMonths();
  }

  handlePeriodSelected(period: Period): void {
    this.periodSelected.emit(period);
  }

  handlerYearSelected(date: DateTime): void {
    this.yearChanged.emit(date.year);
  }

  getItemsForMonth(month: DateTime): CalendarItem[] {
    return this.items().filter((item) => {
      const itemMonth = item.period.start?.month;

      return itemMonth === month.month;
    });
  }

  getMonthKey(month: DateTime): string {
    return `${month.year}-${month.month}`;
  }

  private initializeMonths(): void {
    effect(() => {
      const startMonth = 1;
      const endMonth = 12;

      this.months = [];

      for (let month = startMonth; month <= endMonth; month++) {
        const monthDate = DateTime.fromObject({
          year: this.year(),
          month: month,
          day: 1,
        });

        // Verificamos que el mes se creó correctamente.
        if (monthDate.isValid) {
          this.months.push(monthDate);
        }
      }
    });
  }
}
