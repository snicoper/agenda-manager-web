import { HttpStatusCode } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { BadRequest } from '../../../../../core/models/bad-request';
import { AlertComponent } from '../../../alert/alert.component';

@Component({
  selector: 'am-non-field-errors',
  standalone: true,
  imports: [MatCardModule, MatListModule, AlertComponent],
  templateUrl: './non-field-errors.component.html',
})
export class NonFieldErrorsComponent {
  badRequest = input.required<BadRequest | undefined>();

  get hasError(): boolean {
    if (this.badRequest()?.status === HttpStatusCode.Conflict) {
      return [this.badRequest()?.detail].flat().length > 0;
    }

    return false;
  }

  get getError(): string | undefined {
    if (this.badRequest()?.status === HttpStatusCode.Conflict) {
      return this.badRequest()?.detail;
    }

    return undefined;
  }
}
