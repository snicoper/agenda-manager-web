import { Signal } from '@angular/core';
import { CalendarDetailsResponse } from '../responses/calendar-details.response';

export interface CalendarSelectedState {
  calendarId: Signal<string | null>;
  calendar: Signal<CalendarDetailsResponse | null>;
  isLoading: Signal<boolean>;
}
