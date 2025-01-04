import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { finalize, take } from 'rxjs';
import { Period } from '../../../../core/models/period.model';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { CalendarItem } from '../../../../shared/components/calendars/year-calendar/models/calendar-event.model';
import { YearCalendarComponent } from '../../../../shared/components/calendars/year-calendar/year-calendar.component';
import { CalendarApiService } from '../../services/api/calendar-api.service';
import { CalendarSelectedStateService } from '../../services/state/calendar-selected-state.service';
import {
  CalendarHolidaysCreateBladeComponent,
  CalendarHolidaysCreateDataBlade,
} from '../calendar-holidays-create-blade/calendar-holidays-create-blade.component';

@Component({
  selector: 'am-calendar-holidays-tab',
  imports: [YearCalendarComponent],
  templateUrl: './calendar-holidays-tab.component.html',
  styleUrl: './calendar-holidays-tab.component.scss',
})
export class CalendarHolidaysTabComponent implements OnDestroy {
  private readonly bladeService = inject(BladeService);
  private readonly calendarSelectedStateService = inject(CalendarSelectedStateService);
  private readonly apiService = inject(CalendarApiService);

  private readonly holidays$ = signal<CalendarItem[]>([]);
  private readonly unAvailableDays$ = signal<CalendarItem[]>([]);

  readonly loadingHolidays = signal(false);
  readonly yearSelected = signal(DateTime.local().year);

  readonly combinedItems = computed(() => {
    const holidayItems = this.holidays$();
    const unavailableItems = this.unAvailableDays$();

    return [...holidayItems, ...unavailableItems];
  });

  readonly calendarState = this.calendarSelectedStateService.state;

  constructor() {
    this.loadListeners();
  }

  ngOnDestroy(): void {
    this.bladeService.hide();
  }

  handleDayClick(period: Period): void {
    this.bladeService.show<CalendarHolidaysCreateDataBlade>(CalendarHolidaysCreateBladeComponent, {
      data: { date: period.start },
    });

    this.bladeService.result.pipe(take(1)).subscribe({
      next: () => {
        this.calendarSelectedStateService.refresh();
      },
    });
  }

  handleYearChanged(year: number): void {
    this.yearSelected.set(year);
  }

  private loadListeners(): void {
    effect(() => {
      const date = DateTime.local(this.yearSelected());
      const availableDays = this.calendarState.calendar()?.availableDays;
      const unAvailableDays = DateTimeUtils.nonWeekDaysFromYear(date, availableDays ?? 0);

      this.holidays$.set([]);
      this.unAvailableDays$.set([]);

      this.unAvailableDays$.set(
        unAvailableDays.map((day) => ({
          period: {
            start: day,
            end: day,
          },
          cssClass: 'unavailable',
        })),
      );

      this.loadHolidays();
    });
  }

  private loadHolidays(): void {
    this.loadingHolidays.set(true);
    this.holidays$.set([]);

    this.apiService
      .getCalendarHolidays(this.calendarState.calendarId()!, this.yearSelected())
      .pipe(
        take(1),
        finalize(() => this.loadingHolidays.set(false)),
      )
      .subscribe({
        next: (response) => {
          const mappedHolidays = response.map((holiday) => ({
            period: {
              start: holiday.start,
              end: holiday.end,
            },
            cssClass: 'holiday',
          }));

          this.holidays$.set(mappedHolidays);
        },
      });
  }
}
