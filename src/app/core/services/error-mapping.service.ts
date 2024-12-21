import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { logError } from '../errors/debug-logger';
import { BadRequest, UnknownApiError } from '../models/bad.request';

@Injectable({ providedIn: 'root' })
@Injectable({
  providedIn: 'root',
})
export class ErrorMappingService {
  mapHttpErrorToBadRequest(error: HttpErrorResponse | undefined): BadRequest | undefined {
    if (!this.isValidBadRequest(error?.error)) {
      logError('Invalid error response structure', error);

      return undefined;
    }

    return error.error;
  }

  private isValidBadRequest(error: unknown): error is BadRequest {
    const potentialError = error as UnknownApiError;

    return Boolean(
      potentialError &&
        typeof potentialError.detail === 'string' &&
        typeof potentialError.status === 'number' &&
        typeof potentialError.title === 'string' &&
        typeof potentialError.type === 'string' &&
        (potentialError.code === undefined || typeof potentialError.code === 'string') &&
        potentialError.errors !== undefined,
    );
  }
}
