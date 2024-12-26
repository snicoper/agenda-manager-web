import { Signal } from '@angular/core';
import { CalendarSettingsResponse } from './responses/calendar-settings.response';

export interface CalendarSettingsState {
  calendarId: Signal<string | null>;
  settings: Signal<CalendarSettingsResponse | null>;
  loading: Signal<boolean>;
}
