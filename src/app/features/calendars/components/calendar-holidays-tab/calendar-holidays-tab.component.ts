import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { finalize, take } from 'rxjs';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { CalendarItem } from '../../../../shared/components/calendars/year-calendar/models/calendar-item.model';
import { DateTimeSelectedEvent } from '../../../../shared/components/calendars/year-calendar/models/date-time-selected-event.model';
import { YearCalendarComponent } from '../../../../shared/components/calendars/year-calendar/year-calendar.component';
import { CalendarApiService } from '../../services/api/calendar-api.service';
import { CalendarSelectedStateService } from '../../services/state/calendar-selected-state.service';
import {
  CalendarHolidaysCreateBladeComponent,
  CalendarHolidaysCreateDataBlade,
} from '../calendar-holidays-create-blade/calendar-holidays-create-blade.component';
import {
  CalendarHolidaysUpdateBladeComponent,
  CalendarHolidaysUpdateDataBlade,
} from '../calendar-holidays-update-blade/calendar-holidays-update-blade.component';

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
    this.bladeService.close();
  }

  handleYearChanged(year: number): void {
    this.yearSelected.set(year);
  }

  handleDateTimeSelected(dateTimeSelected: DateTimeSelectedEvent): void {
    if (dateTimeSelected.type === 'holiday') {
      this.updateHoliday(dateTimeSelected);
    } else {
      this.createHoliday(dateTimeSelected);
    }
  }

  private createHoliday(dateTimeSelected: DateTimeSelectedEvent): void {
    this.bladeService.open<CalendarHolidaysCreateDataBlade>(CalendarHolidaysCreateBladeComponent, {
      data: { dateSelected: dateTimeSelected.start },
    });

    this.bladeService.result.pipe(take(1)).subscribe({
      next: () => {
        this.calendarSelectedStateService.refresh();
      },
    });
  }

  private updateHoliday(dateTimeSelected: DateTimeSelectedEvent): void {
    const data: CalendarHolidaysUpdateDataBlade = {
      id: dateTimeSelected.id,
      start: dateTimeSelected.start,
      end: dateTimeSelected.end,
    };

    this.bladeService.open<CalendarHolidaysUpdateDataBlade>(CalendarHolidaysUpdateBladeComponent, {
      data: data,
    });

    this.bladeService.result.pipe(take(1)).subscribe({
      next: () => {
        this.calendarSelectedStateService.refresh();
      },
    });
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
          id: day.toString(),
          period: {
            start: day,
            end: day,
          },
          type: 'unavailable',
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
            id: holiday.calendarHolidayId,
            period: {
              start: holiday.start,
              end: holiday.end,
            },
            type: 'holiday',
            cssClass: 'holiday',
          }));

          this.holidays$.set(mappedHolidays);
        },
      });
  }
}
