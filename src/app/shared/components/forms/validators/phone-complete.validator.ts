import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { FormPhoneNumberField } from '../inputs/form-phone-number/interfaces/form-phone-number-field.interface';

const isValidCountryCodeLength = (countryCode: string): boolean => countryCode.length <= 4;
const isValidNumberLength = (number: string): boolean => number.length <= 15;

const validatePhoneNumberFields = (countryCode: string, number: string): boolean => {
  try {
    const fullCountryCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
    const fullPhoneNumber = `${fullCountryCode}${number}`;

    return isValidPhoneNumber(fullPhoneNumber);
  } catch {
    return false;
  }
};

const checkPhoneFieldsCompleteness = (value: FormPhoneNumberField): boolean => {
  const valuesArray = Object.values(value);
  const allFieldsEmpty = valuesArray.every((v) => v === '' || v === null || v === undefined);
  const allFieldsFilled = valuesArray.every((v) => v !== '' && v !== null && v !== undefined);

  return allFieldsEmpty || allFieldsFilled;
};

const checkPartialFieldsFilling = (value: FormPhoneNumberField): boolean => {
  const valuesArray = Object.values(value);
  const someFieldsFilled = valuesArray.some((v) => v !== '' && v !== null && v !== undefined);
  const someFieldsEmpty = valuesArray.some((v) => v === '' || v === null || v === undefined);

  return someFieldsFilled && someFieldsEmpty;
};

/**
 * Phone Number Validator
 *
 * This validator follows the same validation principles as the backend PhoneNumber Value Object
 * implemented in C# using libphonenumber-csharp. It ensures:
 *
 * - Country code maximum length of 4 characters
 * - Phone number maximum length of 15 digits
 * - Validates phone number using libphonenumber library
 * - Handles both complete and empty phone number fields
 * - Detects partially filled fields
 *
 * Corresponding backend implementation:
 * @see AgendaManager.Domain.Users.ValueObjects.PhoneNumber
 *
 * Validation steps:
 * 1. Check if fields are completely empty or completely filled
 * 2. Validate country code and number length
 * 3. Use libphonenumber to validate the full phone number
 * 4. Handle partial field completion
 */
export const phoneCompleteValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: FormPhoneNumberField = control.value;

    if (!value) {
      return null;
    }

    const isCompleteOrEmpty = checkPhoneFieldsCompleteness(value);

    if (isCompleteOrEmpty) {
      if (value.countryCode && value.number) {
        if (!isValidCountryCodeLength(value.countryCode)) {
          return { phoneInvalid: true };
        }

        if (!isValidNumberLength(value.number)) {
          return { phoneInvalid: true };
        }

        const isValid = validatePhoneNumberFields(value.countryCode, value.number);

        if (!isValid) {
          return { phoneInvalid: true };
        }
      }

      return null;
    }

    const hasPartialFields = checkPartialFieldsFilling(value);

    if (hasPartialFields) {
      return { phoneIncomplete: true };
    }

    return null;
  };
};
