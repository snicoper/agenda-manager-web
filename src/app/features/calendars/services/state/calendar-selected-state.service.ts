import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { CalendarDetailsResponse } from '../../models/responses/calendar-details.response';
import { CalendarSelectedState } from '../../models/state/calendar-selected-state.model';
import { CalendarApiService } from '../api/calendar-api.service';

@Injectable({ providedIn: 'root' })
export class CalendarSelectedStateService {
  private readonly apiService = inject(CalendarApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly router = inject(Router);

  private readonly calendarId$ = signal<string | null>(null);
  private readonly calendar$ = signal<CalendarDetailsResponse | null>(null);
  private readonly isLoading$ = signal<boolean>(false);

  readonly state: CalendarSelectedState = {
    calendarId: computed(() => this.calendarId$()),
    calendar: computed(() => this.calendar$()),
    isLoading: computed(() => this.isLoading$()),
  };

  load(calendarId: string): void {
    if (this.calendar$()) {
      return;
    }

    this.calendarId$.set(calendarId);
    this.loadCalendarDetails();
  }

  refresh(): void {
    if (!this.calendarId$()) {
      logError('CalendarDetailsStateService.refresh', 'Calendar id is not defined');

      return;
    }

    this.loadCalendarDetails();
  }

  setLoadingState(isLoading: boolean): void {
    this.isLoading$.update(() => isLoading);
  }

  clean(): void {
    this.calendarId$.set(null);
    this.calendar$.set(null);
  }

  private loadCalendarDetails(): void {
    if (!this.calendarId$()) {
      logError('CalendarDetailsStateService.loadCalendarDetails', 'Calendar id is not defined');

      return;
    }

    this.isLoading$.set(true);

    this.apiService
      .getCalendarById(this.calendarId$()!)
      .pipe(
        take(1),
        finalize(() => this.isLoading$.set(false)),
      )
      .subscribe({
        next: (response) => this.calendar$.set(response),
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.NotFound) {
            this.snackBarService.error('Calendario no encontrado');
          } else {
            this.snackBarService.error('Error al cargar los detalles del calendario');
          }

          this.router.navigateByUrl(SiteUrls.calendars.list);
        },
      });
  }
}
