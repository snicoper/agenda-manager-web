import { HttpStatusCode } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { BadRequest } from '../../../../../core/http/models/bad-request.model';
import { AlertComponent } from '../../../alert/alert.component';

@Component({
  selector: 'am-non-field-errors',
  imports: [MatCardModule, MatListModule, AlertComponent],
  templateUrl: './non-field-errors.component.html',
})
export class NonFieldErrorsComponent {
  readonly badRequest = input.required<BadRequest | undefined>();

  get hasError(): boolean {
    if (!this.badRequest()) {
      return false;
    }

    return this.badRequest()?.status === HttpStatusCode.Conflict && Boolean(this.badRequest()?.detail);
  }

  get getError(): string | undefined {
    return this.badRequest()?.status === HttpStatusCode.Conflict ? this.badRequest()?.detail : undefined;
  }
}
