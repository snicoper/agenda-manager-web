import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCalendarCellClassFunction, MatCalendarView, MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateTime } from 'luxon';
import { Period } from '../../../../../core/models/period.model';
import { CalendarItem } from '../models/calendar-event.model';

@Component({
  selector: 'am-month-calendar',
  imports: [CommonModule, MatCardModule, MatDatepickerModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './month-calendar.component.html',
  styleUrl: './month-calendar.component.scss',
})
export class MonthCalendarComponent {
  month = input.required<DateTime>();
  items = input.required<CalendarItem[]>();
  loading = input<boolean>(false);

  periodSelected = output<Period>();

  title = computed(() => this.month()?.toLocaleString({ month: 'long', year: 'numeric' }));

  minDate = computed(() => {
    const currentMonth = this.month();

    return DateTime.fromObject({
      year: currentMonth.year,
      month: currentMonth.month,
      day: 1,
    });
  });

  maxDate = computed(() => {
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

  handlePeriodSelected(date: DateTime | null): void {
    if (!date) {
      return;
    }

    // Aquí iría la lógica para crear un nuevo periodo o modificar uno existente.
    this.periodSelected.emit({
      start: date.startOf('day'),
      end: date.endOf('day'),
    });
  }

  private findItem(date: DateTime): CalendarItem | undefined {
    return this.items().find((item) => this.isDateInPeriod(date, item.period));
  }

  private isDateInPeriod(date: DateTime, period: Period): boolean {
    if (!period.start) {
      return false;
    }

    // Si no hay end o end es igual a start, comparamos solo con start.
    if (!period.end || period.start.equals(period.end)) {
      return date.hasSame(period.start, 'day');
    }

    // Si hay un rango, comparamos que esté entre start y end.
    return date >= period.start && date <= period.end;
  }
}
