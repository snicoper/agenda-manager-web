import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormAddressField } from '../inputs/form-address/models/form-address-field.interface';

/** Custom address validator. */
export const addressCompleteValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value: FormAddressField = control.value;

    // Por ahora validación básica - que si hay un campo, los demás sean requeridos.
    if (Object.values(value).some((v) => v) && !Object.values(value).every((v) => v)) {
      return { addressIncomplete: true };
    }

    return null;
  };
};
