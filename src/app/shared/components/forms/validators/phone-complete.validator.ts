import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormPhoneNumberField } from '../inputs/form-phone-number/models/form-phone-number-field.interface';

/** Validación del conjunto de teléfono (código + número). */
export const phoneCompleteValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value as FormPhoneNumberField;

    // Validar que si hay un campo, el otro también debe existir.
    if ((value.countryCode && !value.number) || (!value.countryCode && value.number)) {
      return { phoneIncomplete: true };
    }

    // Si ambos existen, validar cada uno.
    if (value.countryCode && value.number) {
      const isCodeValid = /^\+[0-9]{2,3}$/.test(value.countryCode);
      const isNumberValid = /^[0-9]{6,12}$/.test(value.number);

      if (!isCodeValid || !isNumberValid) {
        return { phoneInvalid: true };
      }
    }

    return null;
  };
};
