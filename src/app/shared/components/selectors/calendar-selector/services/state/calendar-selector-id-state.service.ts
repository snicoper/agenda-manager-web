import { computed, Injectable, signal } from '@angular/core';

/**
 * Servicio que gestiona el estado del selector de calendario seleccionado.
 *
 * Se usa para evitar la dependencia circular entre el interceptor de la API y
 * el estado del selector de calendario.
 *
 * Accesible también desde CalendarSelectorStateService.
 *
 * @see ApiInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class CalendarSelectorIdStateService {
  private readonly calendarId$ = signal<string | null>(null);

  readonly state = computed(() => this.calendarId$());

  setCalendarId(calendarId: string | null): void {
    this.calendarId$.set(calendarId);
  }
}
