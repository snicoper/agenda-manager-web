import { AppointmentConfirmationRequirementStrategy } from '../../../../../modules/calendars/calendar-settings/enums/appointment-confirmation-requirement-strategy.enum';
import { AppointmentOverlappingStrategy } from '../../../../../modules/calendars/calendar-settings/enums/appointment-overlapping-strategy.enum';
import { HolidayConflictStrategy } from '../../../../../modules/calendars/calendar-settings/enums/holiday-conflict-strategy.enum';
import { ResourceScheduleValidationStrategy } from '../../../../../modules/calendars/calendar-settings/enums/resource-schedule-validation-strategy.enum';

export interface FormCalendarSettingsField {
  appointmentConfirmationRequirement: AppointmentConfirmationRequirementStrategy;
  appointmentOverlapping: AppointmentOverlappingStrategy;
  holidayConflict: HolidayConflictStrategy;
  resourceScheduleValidation: ResourceScheduleValidationStrategy;
}
