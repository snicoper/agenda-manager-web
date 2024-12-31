import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormState } from '../../../../../core/forms/models/form-state.model';
import { getValidationErrorMessage } from '../../constants/custom-validator-errors.const';

@Component({
  selector: 'am-field-error',
  imports: [MatListModule, MatIcon],
  templateUrl: './field-error.component.html',
  styleUrl: './field-error.component.scss',
})
export class FieldErrorComponent implements OnInit {
  formState = input.required<FormState>();

  fieldText = input<string>('');
  fieldName = input<string>('');
  validateOnlyOnSubmit = input(false);

  control!: AbstractControl;

  ngOnInit(): void {
    this.control = this.formState().form?.get(this.fieldName()) as AbstractControl;
  }

  formHasErrors(): boolean {
    return !!(this.formState().isSubmitted || (this.formState().form?.touched && this.control?.errors));
  }

  controlHasErrors(): boolean {
    if (!this.control) {
      return false;
    }

    if (this.validateOnlyOnSubmit()) {
      return !!(this.formState().isSubmitted && this.control.errors);
    }

    return !!(this.control.dirty && this.control.errors);
  }

  getBadRequestErrors(): string[] | undefined {
    if (this.formState().badRequest?.status === HttpStatusCode.BadRequest) {
      const errors = this.formState().badRequest?.errors;

      if (errors) {
        return errors[this.fieldName()];
      } else {
        return undefined;
      }
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
