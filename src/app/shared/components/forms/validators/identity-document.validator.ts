import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormIdentityDocumentField } from '../inputs/form-identity-document/models/form-identity-document-field.interface';

/** Validación del conjunto de identity document. */
export const identityDocumentValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: FormIdentityDocumentField = control.value;

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
      return { identityDocumentIncomplete: true };
    }

    return null;
  };
};
