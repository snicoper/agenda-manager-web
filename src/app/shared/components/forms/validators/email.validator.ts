import { AbstractControl, ValidationErrors } from '@angular/forms';

export const customEmailValidator = (control: AbstractControl): ValidationErrors | null => {
  const emailRegex = /^([\w.-]+)@([\w-]+)((\.(\w){2,3})+)$/;
  const isValid = emailRegex.test(control.value);

  return isValid ? null : { email: true };
};
