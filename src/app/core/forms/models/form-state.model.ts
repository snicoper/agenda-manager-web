import { FormGroup } from '@angular/forms';
import { BadRequest } from '../../http/models/bad-request.model';

export interface FormState {
  form: FormGroup;
  badRequest?: BadRequest;
  isSubmitted: boolean;
  isLoading: boolean;
}
