import { DateTime } from 'luxon';

export interface ResourceScheduleResponse {
  scheduleId: string;
  start: DateTime;
  end: DateTime;
}
