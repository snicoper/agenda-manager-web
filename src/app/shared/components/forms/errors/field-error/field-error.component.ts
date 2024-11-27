import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormState } from '../../../../../core/models/form-state';
import { getValidationErrorMessage } from '../../validators/custom-validator-errors';

@Component({
  selector: 'am-field-error',
  standalone: true,
  imports: [MatListModule, MatIcon],
  templateUrl: './field-error.component.html',
  styleUrl: './field-error.component.scss',
})
export class FieldErrorComponent implements OnInit {
  formState = input.required<FormState>();

  fieldText = input<string>('');
  fieldName = input<string>('');
  validateOnlyOnSubmit = input(false);

  control: AbstractControl | undefined;

  ngOnInit(): void {
    this.control = this.formState().form?.get(this.fieldName()) as AbstractControl;
  }

  formHasErrors(): boolean | ValidationErrors | null | undefined {
    return (
      (this.formState().isSubmitted && this.formState().form?.dirty) ||
      (this.formState().form?.touched && this.control?.errors)
    );
  }

  controlHasErrors(): boolean {
    if (!this.control) {
      return false;
    }

    if (this.formState().isSubmitted && this.control.errors) {
      return true;
    }

    if (this.validateOnlyOnSubmit()) {
      return !!(this.formState().isSubmitted && this.control.dirty && this.control.errors);
    }

    return !!(this.control.dirty && this.control.errors);
  }

  getBadRequestErrors(): string[] | undefined {
    if (this.formState().badRequest?.status === HttpStatusCode.BadRequest) {
      return this.formState().badRequest?.errors[this.fieldName()];
    }

    return undefined;
  }

  getValidationErrors(): string[] {
    if (!this.control?.errors) {
      return [];
    }

    return Object.keys(this.control.errors).flatMap((error) => getValidationErrorMessage(error, this.control));
  }
}
