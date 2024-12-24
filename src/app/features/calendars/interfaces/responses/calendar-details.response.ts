import { DateTimeProvider } from '../../../../core/modules/i18n/types/datetime-provider.type';

export interface CalendarDetailsResponse {
  calendarId: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: DateTimeProvider;
}
