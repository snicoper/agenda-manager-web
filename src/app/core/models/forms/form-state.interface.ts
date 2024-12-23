import { FormGroup } from '@angular/forms';
import { BadRequest } from '../http/bad-request.interface';

export interface FormState {
  form: FormGroup;
  badRequest?: BadRequest;
  isSubmitted: boolean;
  isLoading: boolean;
}
