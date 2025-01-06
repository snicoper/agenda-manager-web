import { Validators } from '@angular/forms';
import { colorHexadecimalValidator } from '../../../shared/components/forms/validators/color-hexadecimal.validator';

/** Validators for the resource form. */
export const ResourceFieldsValidators = {
  name: [Validators.required, Validators.maxLength(50)],
  description: [Validators.required, Validators.maxLength(500)],
  category: [Validators.required],
  textColor: [Validators.required, colorHexadecimalValidator()],
  backgroundColor: [Validators.required, colorHexadecimalValidator()],
};
