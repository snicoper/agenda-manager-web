import { Component, effect, inject, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { logInfo } from '../../../../core/errors/logger/logger';
import { Period } from '../../../../core/models/period.model';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { CalendarItem } from '../../../../shared/components/calendars/year-calendar/models/calendar-event.model';
import { YearCalendarComponent } from '../../../../shared/components/calendars/year-calendar/year-calendar.component';
import { CalendarSelectedStateService } from '../../services/state/calendar-selected-state.service';

@Component({
  selector: 'am-calendar-holidays-tab',
  imports: [YearCalendarComponent],
  templateUrl: './calendar-holidays-tab.component.html',
  styleUrl: './calendar-holidays-tab.component.scss',
})
export class CalendarHolidaysTabComponent {
  private readonly bladeService = inject(BladeService);
  private readonly calendarSelectedStateService = inject(CalendarSelectedStateService);

  readonly items = signal<CalendarItem[]>([]);

  year = signal(DateTime.local().year);

  readonly calendarState = this.calendarSelectedStateService.state;

  constructor() {
    this.loadListeners();
  }

  handleDayClick(day: Period): void {
    logInfo('Day clicked', day);
  }

  handleYearChanged(year: number): void {
    this.year.set(year);
  }

  private loadListeners(): void {
    effect(() => {
      // Get the available days for the current year and mark the non-working days.
      const date = DateTime.local(this.year());
      const availableDays = this.calendarState.calendar()?.availableDays;
      const unAvailableDays = DateTimeUtils.nonWeekDaysFromYear(date, availableDays ?? 0);

      // Set the items to mark the non-working days.
      this.items.set(
        unAvailableDays.map((day) => ({
          period: {
            start: day,
            end: day,
          },
        })),
      );
    });
  }
}
