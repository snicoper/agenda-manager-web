import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Contraseñas iguales. */
export const passwordMustMatchValidator = (controlPassword: string, controlConfirmPassword: string): ValidatorFn => {
  return (controls: AbstractControl): ValidationErrors | null => {
    const control = controls.get(controlPassword);
    const checkControl = controls.get(controlConfirmPassword);

    if (control?.value !== checkControl?.value) {
      checkControl?.setErrors({ noPasswordMatch: true });

      return { noPasswordMatch: true };
    }

    return null;
  };
};
