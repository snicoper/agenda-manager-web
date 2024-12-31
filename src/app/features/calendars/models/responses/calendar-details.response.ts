import { DateTimeProvider } from '../../../../core/i18n/types/datetime-provider.type';
import { WeekDay } from '../../../../core/modules/week-days/week-days.type';

export interface CalendarDetailsResponse {
  calendarId: string;
  name: string;
  description: string;
  isActive: boolean;
  availableDays: WeekDay;
  createdAt: DateTimeProvider;
}
