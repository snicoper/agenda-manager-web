import { Period } from '../../../../../core/models/period.model';

export interface CalendarItem {
  period: Period;
  cssClass?: string;
}
