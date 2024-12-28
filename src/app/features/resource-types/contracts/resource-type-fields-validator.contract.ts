import { Validators } from '@angular/forms';

/** Validators for the resource type form */
export const ResourceTypeFieldsValidators = {
  name: [Validators.required, Validators.maxLength(50)],
  description: [Validators.required, Validators.maxLength(500)],
  category: [Validators.required],
} as const;
