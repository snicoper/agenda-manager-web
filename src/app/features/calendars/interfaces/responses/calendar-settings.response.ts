import { AppointmentConfirmationRequirementStrategy } from '../../../../core/modules/calendars/enums/appointment-confirmation-requirement-strategy.enum';
import { AppointmentOverlappingStrategy } from '../../../../core/modules/calendars/enums/appointment-overlapping-strategy.enum';
import { HolidayConflictStrategy } from '../../../../core/modules/calendars/enums/holiday-conflict-strategy.enum';
import { ResourceScheduleValidationStrategy } from '../../../../core/modules/calendars/enums/resource-schedule-validation-strategy.enum';

export interface CalendarSettingsResponse {
  calendarId: string;
  timeZone: string;
  confirmationRequirement: AppointmentConfirmationRequirementStrategy;
  overlapBehavior: AppointmentOverlappingStrategy;
  holidayAppointmentHandling: HolidayConflictStrategy;
  scheduleValidation: ResourceScheduleValidationStrategy;
}
