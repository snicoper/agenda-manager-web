import { Period } from '../../../../../core/models/period.model';

export interface CalendarItem {
  id: string;
  period: Period;
  type: string;
  cssClass?: string;
}
