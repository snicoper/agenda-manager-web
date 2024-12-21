import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Validación de contraseña fuerte que coincide con el backend. */
export const strongPasswordValidator = (): ValidatorFn => {
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
