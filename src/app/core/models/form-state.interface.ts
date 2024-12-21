import { FormGroup } from '@angular/forms';
import { BadRequest } from './bad-request.interface';

export interface FormState {
  form: FormGroup;
  badRequest?: BadRequest;
  isSubmitted: boolean;
  isLoading: boolean;
}
