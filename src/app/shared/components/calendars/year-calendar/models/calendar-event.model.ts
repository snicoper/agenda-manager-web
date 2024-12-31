import { Period } from '../../../../../core/models/period.model';

export interface CalendarEvent {
  period: Period;
  name: string;
  description: string;
}
