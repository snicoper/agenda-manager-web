import { Validators } from '@angular/forms';

/** Validators for the calendar form. */
export const CalendarFieldsValidators = {
  name: [Validators.required, Validators.maxLength(50)],
  description: [Validators.required, Validators.maxLength(100)],
} as const;
