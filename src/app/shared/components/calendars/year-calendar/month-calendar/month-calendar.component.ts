import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCalendarCellClassFunction, MatCalendarView, MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DateTime } from 'luxon';
import { Period } from '../../../../../core/models/period.model';

@Component({
  selector: 'am-month-calendar',
  imports: [CommonModule, MatCardModule, MatDatepickerModule, MatProgressSpinnerModule],
  templateUrl: './month-calendar.component.html',
  styleUrl: './month-calendar.component.scss',
})
export class MonthCalendarComponent {
  month = input.required<DateTime>();
  periods = input.required<Period[]>();
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
      const period = this.findPeriod(cellDate);

      if (period) {
        // Aquí podríamos añadir más lógica para start/end/in-range.
        return 'selected-date';
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
      start: date,
      end: date,
    });
  }

  private findPeriod(date: DateTime): Period | undefined {
    return this.periods().find((period) => this.isDateInPeriod(date, period));
  }

  private isDateInPeriod(date: DateTime, period: Period): boolean {
    if (!period.start || !period.end) {
      return false;
    }

    return date >= period.start && date <= period.end;
  }
}
