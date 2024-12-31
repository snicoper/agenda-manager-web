import { DateTime } from 'luxon';

export interface CalendarSelection {
  start: DateTime;
  end: DateTime | null;
  title: string;
  description?: string;
}
