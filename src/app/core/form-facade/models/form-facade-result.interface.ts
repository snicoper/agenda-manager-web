import { WritableSignal, computed } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { FormState } from '../../models/form-state';
import { FormConfig } from './form-config.interface';

export interface FormFacadeResult<T extends Record<string, unknown>> {
  // Accesores básicos.
  form: FormGroup;
  state: WritableSignal<FormState>;

  // Estado computado.
  isValid: ReturnType<typeof computed<boolean>>;
  isDirty: ReturnType<typeof computed<boolean>>;
  isPristine: ReturnType<typeof computed<boolean>>;

  // Métodos de control.
  submit: (submitFn: () => Observable<unknown>) => Subscription;
  reset: () => void;
  markAsTouched: () => void;

  // Helpers para campos.
  getFieldValue: (fieldName: keyof T) => unknown;
  setFieldValue: (fieldName: keyof T, value: unknown) => void;
  getFieldErrors: (fieldName: keyof T) => unknown;
  getFieldConfig: (fieldName: keyof T) => FormConfig<T>['fields'][keyof T]['component'];

  // Actualizaciones parciales.
  patchValue: (value: Partial<T>) => void;
  setValue: (value: T) => void;
}
