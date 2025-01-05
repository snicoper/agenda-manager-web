import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, take } from 'rxjs';
import { CalendarSelected } from '../../models/calendar-selected';
import { CalendarSelectedState } from '../../models/state/calendar-selector.state';
import { CalendarSelectorApiService } from '../api/calendar-selector-api.service';

@Injectable({ providedIn: 'root' })
export class CalendarSelectedService {
  private readonly apiService = inject(CalendarSelectorApiService);

  private readonly calendars$ = signal<CalendarSelected[]>([]);
  private readonly calendarSelected$ = signal<CalendarSelected | null>(null);
  private readonly calendarId$ = signal<string | null>(null);
  private readonly loading$ = signal<boolean>(false);

  readonly state: CalendarSelectedState = {
    calendars: computed(() => this.calendars$()),
    calendarId: computed(() => this.calendarId$()),
    calendar: computed(() => this.calendarSelected$()),
    loading: computed(() => this.loading$()),
  };

  constructor() {
    this.loadCalendar();
  }

  refresh(): void {
    this.loadCalendar();
  }

  selectCalendar(calendarId: string): void {
    const calendar = this.calendars$().find((c) => c.calendarId === calendarId);

    if (!calendar) {
      throw new Error('Calendar not found');
    }

    this.calendarSelected$.set(calendar);
  }

  private loadCalendar(): void {
    this.loading$.set(true);

    this.apiService
      .getCalendars()
      .pipe(
        take(1),
        finalize(() => this.loading$.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.calendars$.set(response);
        },
      });
  }
}
