import { AppointmentConfirmationRequirementStrategy } from '../../../../core/modules/calendar-settings/appointment-confirmation-requirement/appointment-confirmation-requirement-strategy.enum';
import { AppointmentOverlappingStrategy } from '../../../../core/modules/calendar-settings/appointment-overlapping/appointment-overlapping-strategy.enum';
import { HolidayConflictStrategy } from '../../../../core/modules/calendar-settings/holiday-conflict/holiday-conflict-strategy.enum';
import { ResourceScheduleValidationStrategy } from '../../../../core/modules/calendar-settings/resource-schedule-validation/resource-schedule-validation-strategy.enum';

export interface CalendarSettingsResponse {
  calendarId: string;
  timeZone: string;
  appointmentConfirmationRequirement: AppointmentConfirmationRequirementStrategy;
  appointmentOverlapping: AppointmentOverlappingStrategy;
  holidayConflict: HolidayConflictStrategy;
  resourceScheduleValidation: ResourceScheduleValidationStrategy;
}
