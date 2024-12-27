export interface CalendarUpdateSettingsRequest {
  calendarId: string;
  timeZone: string;
  appointmentConfirmationRequirement: string;
  appointmentOverlapping: string;
  holidayConflict: string;
  resourceScheduleValidation: string;
}
