import { Signal } from '@angular/core';
import { CalendarDetailsResponse } from './responses/calendar-details.response';

export interface CalendarDetailsState {
  calendarId: Signal<string | null>;
  calendar: Signal<CalendarDetailsResponse | null>;
  loading: Signal<boolean>;
}
