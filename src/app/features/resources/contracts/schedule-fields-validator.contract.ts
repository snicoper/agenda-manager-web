import { Validators } from '@angular/forms';

export const ScheduleFieldsValidators = {
  name: [Validators.required, Validators.maxLength(50)],
  description: [Validators.required, Validators.maxLength(500)],
  type: [Validators.required],
  availableDays: [Validators.required],
  start: [Validators.required],
  end: [Validators.required],
};
