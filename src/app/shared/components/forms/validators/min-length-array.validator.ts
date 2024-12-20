import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Validación de longitud mínima de array. */
export const customMinLengthArrayValidator = (min: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!Array.isArray(control?.value)) {
      return { notArray: true };
    }

    if (control.value.length < min) {
      return { minLengthArray: { min, current: control.value.length } };
    }

    return null;
  };
};
