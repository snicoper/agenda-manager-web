import { DateTime } from 'luxon';
import { ResourceScheduleType } from '../../../../core/modules/resource-management/resource-schedules/resource-schedule.type';
import { WeekDay } from '../../../../core/modules/week-days/week-days.type';

export interface ScheduleCreateRequest {
  resourceId: string;
  name: string;
  description: string;
  type: ResourceScheduleType;
  availableDays: WeekDay;
  start: DateTime;
  end: DateTime;
}
