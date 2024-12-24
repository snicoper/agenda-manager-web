import { Validators } from '@angular/forms';

/** Validators for the Role form. */
export const RoleFieldsValidators = {
  name: [Validators.required, Validators.maxLength(100)],
  description: [Validators.required, Validators.maxLength(500)],
} as const;
