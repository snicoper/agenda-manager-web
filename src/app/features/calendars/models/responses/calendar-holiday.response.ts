import { DateTime } from 'luxon';

export interface CalendarHolidayResponse {
  calendarHolidayId: string;
  name: string;
  start: DateTime;
  end: DateTime;
}
