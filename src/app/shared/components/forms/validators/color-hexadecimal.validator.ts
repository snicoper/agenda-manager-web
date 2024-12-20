import { AbstractControl, ValidationErrors } from '@angular/forms';

/** El valor ha de ser un color hexadecimal. */
export const customColorHexadecimalValidator = (control: AbstractControl): ValidationErrors | null => {
  const match = /^#[0-9A-F]{6}$/i.test(control?.value);

  if (!match) {
    return { colorHexadecimal: true };
  }

  return null;
};
