import { FormGroup } from '@angular/forms';
import { BadRequest } from './bad-request';

export interface FormState {
  form: FormGroup;
  badRequest?: BadRequest;
  isSubmitted: boolean;
  isLoading: boolean;
}
