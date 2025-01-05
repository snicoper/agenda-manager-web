import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, take } from 'rxjs';
import { BrowserStorageKey } from '../../../../../../core/enums/browser-storage-key.enum';
import { BrowserStorageService } from '../../../../../../core/services/browser-storage.service';
import { SnackBarService } from '../../../../../../core/services/snackbar.service';
import { CalendarSelected } from '../../models/calendar-selected';
import { CalendarSelectedState } from '../../models/state/calendar-selector.state';
import { CalendarSelectorApiService } from '../api/calendar-selector-api.service';

@Injectable({ providedIn: 'root' })
export class CalendarSelectorStateService {
  private readonly apiService = inject(CalendarSelectorApiService);
  private readonly browserStorageService = inject(BrowserStorageService);
  private readonly snackBarService = inject(SnackBarService);

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
    this.loadCalendarFromStorage();
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
    this.browserStorageService.setObject(BrowserStorageKey.CalendarSelected, this.calendarSelected$());

    // Notify the user that the calendar has been selected.
    if (this.calendars$().length > 1) {
      this.snackBarService.success('Calendario seleccionado correctamente');
    }
  }

  private loadCalendarFromStorage(): void {
    const calendar = this.browserStorageService.getParse<CalendarSelected>(BrowserStorageKey.CalendarSelected);

    if (calendar) {
      this.calendarSelected$.set(calendar);
      this.calendarId$.set(calendar.calendarId);
    }
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

          // If there is only one calendar, select it.
          if (response.length === 1) {
            this.selectCalendar(response[0].calendarId);
          }
        },
      });
  }
}
