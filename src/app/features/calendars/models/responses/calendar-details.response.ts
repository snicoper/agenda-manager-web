import { DateTime } from 'luxon';
import { WeekDay } from '../../../../core/modules/week-days/week-days.type';

export interface CalendarDetailsResponse {
  calendarId: string;
  name: string;
  description: string;
  isActive: boolean;
  availableDays: WeekDay;
  createdAt: DateTime;
}
