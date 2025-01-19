import { ResourceScheduleType } from '../../../../core/modules/resource-management/resource-schedule-type/resource-schedule-type.enum';
import { WeekDay } from '../../../../core/modules/week-days/week-days.type';

export interface ScheduleCreateRequest {
  name: string;
  description: string;
  type: ResourceScheduleType;
  availableDays: WeekDay;
  start: string;
  end: string;
}
