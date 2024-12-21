import { AbstractControl, ValidationErrors } from '@angular/forms';

/** El valor ha de ser un color hexadecimal. */
export const customColorHexadecimalValidator = (): ValidationErrors | null => {
  return (control: AbstractControl): ValidationErrors | null => {
    const match = /^#[0-9A-F]{6}$/i;
    const isValid = match.test(control.value);

    return isValid ? null : { colorHexadecimal: true };
  };
};
