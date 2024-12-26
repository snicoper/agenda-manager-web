import { AppointmentConfirmationRequirementStrategy } from '../../../../../modules/calendar-settings/enums/appointment-confirmation-requirement-strategy.enum';
import { AppointmentOverlappingStrategy } from '../../../../../modules/calendar-settings/enums/appointment-overlapping-strategy.enum';
import { HolidayConflictStrategy } from '../../../../../modules/calendar-settings/enums/holiday-conflict-strategy.enum';
import { ResourceScheduleValidationStrategy } from '../../../../../modules/calendar-settings/enums/resource-schedule-validation-strategy.enum';

export interface FormCalendarSettingsField {
  confirmationRequirement: AppointmentConfirmationRequirementStrategy;
  overlapBehavior: AppointmentOverlappingStrategy;
  holidayAppointmentHandling: HolidayConflictStrategy;
  scheduleValidation: ResourceScheduleValidationStrategy;
}
