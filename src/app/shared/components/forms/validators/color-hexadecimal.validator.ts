import { AbstractControl, ValidationErrors } from '@angular/forms';

/** El valor ha de ser un color hexadecimal. */
export const colorHexadecimalValidator = (): ValidationErrors | null => {
  return (control: AbstractControl): ValidationErrors | null => {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    const isValid = hexColorRegex.test(control.value);

    return isValid ? null : { colorHexadecimal: true };
  };
};
