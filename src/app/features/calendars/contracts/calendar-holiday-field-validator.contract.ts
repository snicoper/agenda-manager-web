import { Validators } from '@angular/forms';

export const CalendarHolidayFieldsValidators = {
  name: [Validators.required, Validators.maxLength(50)],
  start: [Validators.required],
  end: [Validators.required],
};
