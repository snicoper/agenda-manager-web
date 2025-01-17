import { Signal } from '@angular/core';
import { CalendarSelected } from '../calendar-selected';

export interface CalendarSelectedState {
  calendars: Signal<CalendarSelected[]>;
  calendarId: Signal<string | null>;
  calendar: Signal<CalendarSelected | null>;
  isLoading: Signal<boolean>;
}
