import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BadRequest } from '../models/bad.request';

/** Mapea un HttpErrorResponse a BadRequest. */
@Injectable({ providedIn: 'root' })
export class HttpErrorResponseMappingService {
  mapToBadRequest(httpError: HttpErrorResponse): BadRequest | undefined {
    const error = httpError.error;

    if (!this.isValidBadRequestStructure(error)) {
      return undefined;
    }

    return error;
  }

  private isValidBadRequestStructure(error: unknown): error is BadRequest {
    const potentialError = error as Partial<BadRequest>;

    return Boolean(
      potentialError &&
        typeof potentialError.type === 'string' &&
        typeof potentialError.status === 'number' &&
        typeof potentialError.title === 'string' &&
        potentialError.errors &&
        typeof potentialError.errors === 'object',
    );
  }
}
