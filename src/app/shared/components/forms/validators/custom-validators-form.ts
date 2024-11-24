import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

export abstract class CustomValidators {
  /** Comprobar que un campo sea un email. */
  static readonly email = (control: AbstractControl): ValidationErrors | null => {
    const emailRegex = /^([\w.-]+)@([\w-]+)((\.(\w){2,3})+)$/;
    const isValid = emailRegex.test(control.value);

    return isValid ? null : { email: true };
  };

  /** Comprobar que una fecha sea menor a otra. */
  static readonly dateStartGreaterThanFinish = (controlDateStart: string, controlDateFinish: string): ValidatorFn => {
    return (controls: AbstractControl): ValidationErrors | null => {
      const start = DateTime.fromJSDate(new Date(controls.get(controlDateStart)?.value));
      const finish = DateTime.fromJSDate(new Date(controls.get(controlDateFinish)?.value));

      if (start > finish) {
        controls.get(controlDateFinish)?.setErrors({ startGreaterThanFinish: true });

        return { startGreaterThanFinish: true };
      }

      return null;
    };
  };

  /** Contraseñas iguales. */
  static readonly passwordMustMatch = (controlPassword: string, controlConfirmPassword: string): ValidatorFn => {
    return (controls: AbstractControl): ValidationErrors | null => {
      const control = controls.get(controlPassword);
      const checkControl = controls.get(controlConfirmPassword);

      if (control?.value !== checkControl?.value) {
        checkControl?.setErrors({ noPasswordMatch: true });

        return { noPasswordMatch: true };
      }

      return null;
    };
  };

  /** El valor ha de ser un color hexadecimal. */
  static readonly colorHexadecimal = (control: AbstractControl): ValidationErrors | null => {
    const match = /^#[0-9A-F]{6}$/i.test(control?.value);

    if (!match) {
      return { colorHexadecimal: true };
    }

    return null;
  };

  /** No permite fechas futuras. */
  static readonly noFutureDate = (control: AbstractControl): ValidationErrors | null => {
    const value = DateTime.fromJSDate(new Date(control?.value));

    if (value.toMillis() > DateTime.local().toMillis()) {
      return { noFutureDate: true };
    }

    return null;
  };

  /** Validación de longitud mínima de array */
  static readonly minLengthArray = (min: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!Array.isArray(control?.value)) {
        return { notArray: true };
      }

      if (control.value.length < min) {
        return { minLengthArray: { min, current: control.value.length } };
      }

      return null;
    };
  };

  /** Validación de contraseña fuerte que coincide con el backend */
  static readonly strongPassword = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const password = control.value;

      const checks = {
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[#?!@$%^&*-]/.test(password),
        minLength: password.length >= 8,
      };

      // Si todo está bien, retorna null.
      if (Object.values(checks).every(Boolean)) {
        return null;
      }

      // Si algo falla, retorna los errores específicos.
      return {
        strongPassword: {
          requiredChecks: checks,
          failedChecks: Object.entries(checks)
            .filter(([, valid]) => !valid)
            .map(([check]) => check),
        },
      };
    };
  };
}
