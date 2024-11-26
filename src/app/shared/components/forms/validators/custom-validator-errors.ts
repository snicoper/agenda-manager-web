/* eslint-disable @typescript-eslint/no-explicit-any */

import { AbstractControl } from '@angular/forms';

/** Mensajes de error para validaciones */
export const CustomValidationErrors = {
  /** Errores genéricos */
  required: 'Este campo es obligatorio',
  email: 'El formato del email no es válido',
  minlength: (min: number) => `Debe tener al menos ${min} caracteres`,
  maxlength: (max: number) => `No puede tener más de ${max} caracteres`,

  /** Errores personalizados */
  startGreaterThanFinish: 'La fecha de inicio no puede ser mayor que la de fin',
  noPasswordMatch: 'Las contraseñas no coinciden',
  strongPassword: {
    default: 'La contraseña no cumple con los requisitos de seguridad',
    uppercase: 'Debe contener al menos una mayúscula',
    lowercase: 'Debe contener al menos una minúscula',
    number: 'Debe contener al menos un número',
    specialChar: 'Debe contener al menos un carácter especial (#?!@$%^&*-)',
    minLength: 'Debe tener al menos 8 caracteres',
  },
  colorHexadecimal: 'El color debe estar en formato hexadecimal (#RRGGBB)',
  noFutureDate: 'La fecha no puede ser futura',
  noWhitespace: 'No se permiten espacios en blanco',
  minLengthArray: (min: number) => `Debe seleccionar al menos ${min} elementos`,
} as const;

// Y un helper para obtener los mensajes fácilmente.
export const getValidationErrorMessage = (error: string, control?: AbstractControl, params?: any): string => {
  const errorMessage = CustomValidationErrors[error as keyof typeof CustomValidationErrors];

  // Caso especial para strongPassword.
  if (error === 'strongPassword' && control?.errors?.['strongPassword']) {
    const failedChecks = control.errors['strongPassword'].failedChecks;

    if (failedChecks?.length > 0) {
      return failedChecks
        .map(
          (check: string) =>
            CustomValidationErrors.strongPassword[check as keyof typeof CustomValidationErrors.strongPassword],
        )
        .join(', ');
    }

    return CustomValidationErrors.strongPassword.default;
  }

  if (typeof errorMessage === 'function') {
    return errorMessage(params);
  }

  if (typeof errorMessage === 'object') {
    return errorMessage.default;
  }

  return errorMessage || `Error de validación: ${error}`;
};
