import { Validators } from '@angular/forms';
import { addressCompleteValidator } from '../../../shared/components/forms/validators/address-complete.validator';
import { emailValidator } from '../../../shared/components/forms/validators/email.validator';
import { identityDocumentValidator } from '../../../shared/components/forms/validators/identity-document.validator';
import { minLengthArrayValidator } from '../../../shared/components/forms/validators/min-length-array.validator';
import { phoneCompleteValidator } from '../../../shared/components/forms/validators/phone-complete.validator';

/** Validators for the account fields. */
export const AccountFieldsValidators = {
  email: [Validators.required, emailValidator()],
  firstName: [Validators.required, Validators.maxLength(100)],
  lastName: [Validators.required, Validators.maxLength(100)],
  roles: [minLengthArrayValidator(1)],
  phone: [phoneCompleteValidator()],
  address: [addressCompleteValidator()],
  identityDocument: [identityDocumentValidator()],
};
