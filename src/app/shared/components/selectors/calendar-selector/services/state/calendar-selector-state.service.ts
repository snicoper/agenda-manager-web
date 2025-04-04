import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, take } from 'rxjs';
import { BrowserStorageKey } from '../../../../../../core/enums/browser-storage-key.enum';
import { BrowserStorageService } from '../../../../../../core/services/browser-storage.service';
import { SnackBarService } from '../../../../../../core/services/snackbar.service';
import { CalendarSelected } from '../../models/calendar-selected';
import { CalendarSelectedState } from '../../models/state/calendar-selector.state';
import { CalendarSelectorApiService } from '../api/calendar-selector-api.service';
import { CalendarSelectorIdStateService } from './calendar-selector-id-state.service';

@Injectable({ providedIn: 'root' })
export class CalendarSelectorStateService {
  private readonly calendarSelectorIdState = inject(CalendarSelectorIdStateService);

  private readonly apiService = inject(CalendarSelectorApiService);
  private readonly browserStorageService = inject(BrowserStorageService);
  private readonly snackBarService = inject(SnackBarService);

  private readonly calendars$ = signal<CalendarSelected[]>([]);
  private readonly calendarSelected$ = signal<CalendarSelected | null>(null);
  private readonly isLoading$ = signal<boolean>(false);

  readonly state: CalendarSelectedState = {
    calendars: computed(() => this.calendars$()),
    calendarId: computed(() => this.calendarSelectorIdState.state()),
    calendar: computed(() => this.calendarSelected$()),
    isLoading: computed(() => this.isLoading$()),
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
    this.calendarSelectorIdState.setCalendarId(calendarId);
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
      this.calendarSelectorIdState.setCalendarId(calendar.calendarId);
    }
  }

  private loadCalendar(): void {
    this.isLoading$.set(true);

    this.apiService
      .getCalendars()
      .pipe(
        take(1),
        finalize(() => this.isLoading$.set(false)),
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
