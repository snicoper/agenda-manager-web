import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DomainRegexUtils } from '../../../../core/utils/common/domain-regex.utils';

/** Validación de correo electrónico. */
export const emailValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = DomainRegexUtils.email.test(control.value);

    return isValid ? null : { email: true };
  };
};
