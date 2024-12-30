import { HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { CalendarSettingsResponse } from '../../interfaces/responses/calendar-settings.response';
import { CalendarSettingsSelectedState } from '../../interfaces/state/calendar-settings-selected-state.interface';
import { CalendarApiService } from '../api/calendar-api.service';
import { CalendarSelectedStateService } from './calendar-selected-state.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarSettingsSelectedStateService {
  private readonly apiService = inject(CalendarApiService);
  private readonly calendarSelectedStateService = inject(CalendarSelectedStateService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly router = inject(Router);

  private readonly settings$ = signal<CalendarSettingsResponse | null>(null);
  private readonly loading$ = signal<boolean>(false);

  readonly state: CalendarSettingsSelectedState = {
    calendarId: this.calendarSelectedStateService.state.calendarId,
    settings: computed(() => this.settings$()),
    loading: computed(() => this.loading$()),
  };

  load(): void {
    if (!this.state.calendarId()) {
      logError('CalendarSettingsStateService.load', 'Calendar id is not defined');

      return;
    }

    this.loadCalendarSettings();
  }

  refresh(): void {
    this.loadCalendarSettings();
  }

  setLoadingState(isLoading: boolean): void {
    this.loading$.update(() => isLoading);
  }

  clean(): void {
    this.settings$.set(null);
  }

  private loadCalendarSettings(): void {
    if (!this.state.calendarId()) {
      logError('CalendarSettingsStateService.loadCalendarDetails', 'Calendar id is not defined');

      return;
    }

    this.loading$.set(true);

    this.apiService
      .getCalendarSettings(this.state.calendarId()!)
      .pipe(
        take(1),
        finalize(() => this.loading$.set(false)),
      )
      .subscribe({
        next: (response) => this.settings$.set(response),
        error: (error) => {
          logError('CalendarSettingsStateService.loadCalendarSettings', error);

          if (error.status === HttpStatusCode.NotFound) {
            this.snackBarService.error('El calendario no existe');
          } else {
            this.snackBarService.error('Error al cargar los detalles del calendario');
          }

          this.router.navigateByUrl(SiteUrls.calendars.list);
        },
      });
  }
}
