import { Validators } from '@angular/forms';

export const RoleFormConfig = {
  name: {
    initialValue: '',
    validators: [Validators.required, Validators.maxLength(100)],
  },
  description: {
    initialValue: '',
    validators: [Validators.required, Validators.maxLength(500)],
  },
} as const;

export type RoleFormContract = typeof RoleFormConfig;
