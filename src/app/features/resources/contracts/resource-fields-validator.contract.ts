import { Validators } from '@angular/forms';
import { colorHexadecimalValidator } from '../../../shared/components/forms/validators/color-hexadecimal.validator';

/** Validators for the resource form. */
export const ResourceFieldsValidators = {
  resourceType: [Validators.required],
  userId: [],
  name: [Validators.required, Validators.maxLength(50)],
  description: [Validators.required, Validators.maxLength(500)],
  textColor: [Validators.required, Validators.maxLength(7), colorHexadecimalValidator()],
  backgroundColor: [Validators.required, Validators.maxLength(7), colorHexadecimalValidator()],
};
