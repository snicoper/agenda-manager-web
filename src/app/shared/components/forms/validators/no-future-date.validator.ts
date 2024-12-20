import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DateTime } from 'luxon';

/** No permite fechas futuras. */
export const customNoFutureDateValidator = (control: AbstractControl): ValidationErrors | null => {
  const value = DateTime.fromJSDate(new Date(control?.value));

  if (value.toMillis() > DateTime.local().toMillis()) {
    return { noFutureDate: true };
  }

  return null;
};
