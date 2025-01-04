import { DateTime } from 'luxon';

export interface DateTimeSelectedEvent {
  id: string;
  start: DateTime;
  end: DateTime;
  type: string;
}
