import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCalendarCellClassFunction, MatCalendarView, MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateTime } from 'luxon';
import { CalendarItem } from '../models/calendar-item.model';
import { DateTimeSelectedEvent } from '../models/date-time-selected-event.model';

@Component({
  selector: 'am-month-calendar',
  imports: [CommonModule, MatCardModule, MatDatepickerModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './month-calendar.component.html',
  styleUrl: './month-calendar.component.scss',
})
export class MonthCalendarComponent {
  readonly month = input.required<DateTime>();
  readonly items = input.required<CalendarItem[]>();
  readonly loading = input<boolean>(false);

  readonly dateTimeSelected = output<DateTimeSelectedEvent>();

  readonly title = computed(() => this.month()?.toLocaleString({ month: 'long', year: 'numeric' }));

  readonly minDate = computed(() => {
    const currentMonth = this.month();

    return DateTime.fromObject({
      year: currentMonth.year,
      month: currentMonth.month,
      day: 1,
    });
  });

  readonly maxDate = computed(() => {
    const currentMonth = this.month();

    return DateTime.fromObject({
      year: currentMonth.year,
      month: currentMonth.month,
      day: currentMonth.daysInMonth,
    });
  });

  dateClass: MatCalendarCellClassFunction<DateTime> = (cellDate: DateTime, view: MatCalendarView) => {
    if (view === 'month') {
      const item = this.findItem(cellDate);

      if (item) {
        const classes = [item.cssClass || 'selected-date', 'calendar-item'];

        return classes;
      }
    }

    return '';
  };

  handleDatetimeSelected(date: DateTime | null): void {
    if (!date) {
      return;
    }

    const selectedDate = date.startOf('day');
    const existingItem = this.findItem(selectedDate);

    this.dateTimeSelected.emit({
      id: existingItem?.id || '',
      start: date.startOf('day'),
      end: date.endOf('day'),
      type: existingItem?.type || '',
    });
  }

  private findItem(date: DateTime): CalendarItem | undefined {
    return this.items().find((item) => {
      const startDate = item.period.start;
      const endDate = item.period.end || startDate;
      const checkDate = date.startOf('day');

      // Verificamos si la fecha está en el rango entre start y end.
      return checkDate >= startDate.startOf('day') && checkDate <= endDate.startOf('day');
    });
  }
}
