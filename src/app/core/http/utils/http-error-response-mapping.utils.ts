import { HttpErrorResponse } from '@angular/common/http';
import { BadRequest } from '../models/bad-request.model';

/** Mapea un HttpErrorResponse a BadRequest. */
export abstract class HttpErrorResponseMappingUtils {
  static mapToBadRequest(httpError: HttpErrorResponse): BadRequest | undefined {
    const badRequest: BadRequest = httpError.error;

    return badRequest;
  }
}
