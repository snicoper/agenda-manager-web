import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

/** Comprobar que la fecha de start no sea mayor a la de end. */
export const dateStartGreaterThanEndValidator = (controlDateStart: string, controlDateEnd: string): ValidatorFn => {
  return (controls: AbstractControl): ValidationErrors | null => {
    const start = DateTime.fromJSDate(new Date(controls.get(controlDateStart)?.value));
    const end = DateTime.fromJSDate(new Date(controls.get(controlDateEnd)?.value));

    if (start > end) {
      controls.get(controlDateEnd)?.setErrors({ startGreaterThanFinish: true });

      return { startGreaterThanFinish: true };
    }

    return null;
  };
};
