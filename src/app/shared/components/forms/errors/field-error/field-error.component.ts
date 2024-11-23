import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, input } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { MatHint } from '@angular/material/form-field';
import { BadRequest } from '../../../../../core/models/bad-request';

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

  getControlErrorByErrorName(errorName: string): ValidationErrors | null {
    return this.control?.hasError(errorName) ? this.control.errors : null;
  }

  /** Maneja un error "Validator.max(x)" de Angular. */
  getValidationErrorMax(): { max: number; actual: number } | void {
    const validationError = this.getControlErrorByErrorName('max');

    if (validationError) {
      const data = validationError['max'];

      return data;
    }
  }

  /** Maneja un error "Validator.min(x)" de Angular. */
  getValidationErrorMin(): { min: number; actual: number } | void {
    const validationError = this.getControlErrorByErrorName('min');

    if (validationError) {
      const data = validationError['min'];

      return data;
    }
  }
}
