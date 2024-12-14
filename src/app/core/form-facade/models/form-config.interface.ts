import { HttpErrorResponse } from '@angular/common/http';
import { ValidatorFn } from '@angular/forms';
import { FormFieldConfig } from './form-field-config.interface';

export interface FormConfig<T extends Record<string, unknown>> {
  fields: {
    [K in keyof T]: FormFieldConfig<T[K]>;
  };
  validators?: ValidatorFn[];
  onSuccess?: () => void;
  reset?: () => void;
  onError?: (error: HttpErrorResponse) => void;
}
