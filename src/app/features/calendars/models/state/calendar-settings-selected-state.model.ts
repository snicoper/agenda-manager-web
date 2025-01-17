import { Signal } from '@angular/core';
import { CalendarSettingsResponse } from '../responses/calendar-settings.response';

export interface CalendarSettingsSelectedState {
  calendarId: Signal<string | null>;
  settings: Signal<CalendarSettingsResponse | null>;
  isLoading: Signal<boolean>;
}
