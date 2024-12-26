import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormAddressField } from '../inputs/form-address/interfaces/form-address-field.interface';

/** Validación del conjunto de una dirección. */
export const addressCompleteValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: FormAddressField = control.value;

    if (!value) {
      return null;
    }

    const valuesArray = Object.values(value);
    const allFieldsEmpty = valuesArray.every((v) => v === '' || v === null || v === undefined);
    const allFieldsFilled = valuesArray.every((v) => v !== '' && v !== null && v !== undefined);

    if (allFieldsEmpty || allFieldsFilled) {
      return null;
    }

    const someFieldsFilled = valuesArray.some((v) => v !== '' && v !== null && v !== undefined);
    const someFieldsEmpty = valuesArray.some((v) => v === '' || v === null || v === undefined);

    if (someFieldsFilled && someFieldsEmpty) {
      return { addressIncomplete: true };
    }

    return null;
  };
};
