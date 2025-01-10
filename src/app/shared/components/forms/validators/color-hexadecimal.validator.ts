import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DomainRegexUtils } from '../../../../core/utils/common/domain-regex.utils';

/** El valor ha de ser un color hexadecimal. */
export const colorHexadecimalValidator = (): ValidationErrors | null => {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = DomainRegexUtils.colorHexadecimal.test(control.value);

    return isValid ? null : { colorHexadecimal: true };
  };
};
