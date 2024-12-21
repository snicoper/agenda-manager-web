import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormIdentityDocumentField } from '../inputs/form-identity-document/models/form-identity-document-field.interface';

/** Validación del conjunto de identity document. */
export const identityDocumentValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value as FormIdentityDocumentField;

    // Validar que si hay un campo, los otros también deben existir.
    if (Object.values(value).some((v) => v) && !Object.values(value).every((v) => v)) {
      return { identityDocumentIncomplete: true };
    }

    return null;
  };
};
