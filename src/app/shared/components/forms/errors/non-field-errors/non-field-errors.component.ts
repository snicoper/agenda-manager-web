import { HttpStatusCode } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { BadRequest } from '../../../../../core/models/bad-request';

@Component({
  selector: 'am-non-field-errors',
  standalone: true,
  imports: [MatCardModule, MatListModule],
  templateUrl: './non-field-errors.component.html',
})
export class NonFieldErrorsComponent {
  badRequest = input.required<BadRequest | undefined>();

  get hasErrors(): boolean {
    if (this.badRequest()?.status === HttpStatusCode.Conflict) {
      return !!Object.values(this.badRequest()?.errors as Record<string, string[]>).flat().length;
    }

    return false;
  }

  getErrors(): string[] | undefined {
    if (this.badRequest()?.status === HttpStatusCode.Conflict) {
      return Object.values(this.badRequest()?.errors as Record<string, string[]>).flat();
    }

    return undefined;
  }
}
