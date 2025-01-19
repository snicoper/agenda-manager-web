import { DateTime } from 'luxon';
import { WeekDay } from '../../../../core/modules/week-days/week-days.type';
import { ResourceScheduleType } from '../../../../core/modules/resource-management/resource-schedule-type/resource-schedule-type.enum';

export interface ScheduleCreateRequest {
  name: string;
  description: string;
  type: ResourceScheduleType;
  availableDays: WeekDay;
  start: DateTime;
  end: DateTime;
}
