import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, input } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { MatHint } from '@angular/material/form-field';
import { BadRequest } from '../../../../../core/models/bad-request';
import { getValidationErrorMessage } from '../../validators/custom-validator-errors';

@Component({
  selector: 'am-field-error',
  standalone: true,
  imports: [MatHint],
  templateUrl: './field-error.component.html',
  styleUrl: './field-error.component.scss',
})
export class FieldErrorComponent implements OnInit {
  badRequest = input.required<BadRequest | undefined>();
  form = input.required<FormGroup>();
  submitted = input(false);
  fieldText = input<string>('');
  fieldName = input<string>('');
  validateOnlyOnSubmit = input(false);

  control: AbstractControl | undefined;

  ngOnInit(): void {
    this.control = this.form()?.get(this.fieldName()) as AbstractControl;
  }

  formHasErrors(): boolean | ValidationErrors | null | undefined {
    return (this.submitted() && this.form()?.dirty) || (this.form()?.touched && this.control?.errors);
  }

  controlHasErrors(): boolean {
    if (!this.control) {
      return false;
    }

    if (this.submitted() && this.control.errors) {
      return true;
    }

    if (this.validateOnlyOnSubmit()) {
      return !!(this.submitted() && this.control.dirty && this.control.errors);
    }

    return !!(this.control.dirty && this.control.errors);
  }

  getBadRequestErrors(): string[] | undefined {
    if (this.badRequest()?.status === HttpStatusCode.BadRequest) {
      return this.badRequest()?.errors[this.fieldName()];
    }

    return undefined;
  }

  getValidationErrors(): string[] | undefined {
    if (!this.control?.errors) {
      return [];
    }

    return Object.keys(this.control.errors).map((error) => getValidationErrorMessage(error));
  }
}
