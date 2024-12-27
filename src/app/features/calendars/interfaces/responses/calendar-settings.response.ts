import { AppointmentConfirmationRequirementStrategy } from '../../../../shared/modules/calendars/calendar-settings/enums/appointment-confirmation-requirement-strategy.enum';
import { AppointmentOverlappingStrategy } from '../../../../shared/modules/calendars/calendar-settings/enums/appointment-overlapping-strategy.enum';
import { HolidayConflictStrategy } from '../../../../shared/modules/calendars/calendar-settings/enums/holiday-conflict-strategy.enum';
import { ResourceScheduleValidationStrategy } from '../../../../shared/modules/calendars/calendar-settings/enums/resource-schedule-validation-strategy.enum';

export interface CalendarSettingsResponse {
  calendarId: string;
  timeZone: string;
  appointmentConfirmationRequirement: AppointmentConfirmationRequirementStrategy;
  appointmentOverlapping: AppointmentOverlappingStrategy;
  holidayConflict: HolidayConflictStrategy;
  resourceScheduleValidation: ResourceScheduleValidationStrategy;
}
