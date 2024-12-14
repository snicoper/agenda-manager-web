import { ValidatorFn } from '@angular/forms';

export interface FormFieldConfig<T = unknown> {
  value: T;
  validators?: ValidatorFn[];
  component?: {
    type?: string;
    label: string;
    icon?: string;
    placeholder?: string;
  };
}
