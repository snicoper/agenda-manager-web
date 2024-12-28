import { HttpErrorResponse } from '@angular/common/http';
import { BadRequest } from '../interfaces/bad-request.interface';

/** Mapea un HttpErrorResponse a BadRequest. */
export abstract class HttpErrorResponseMappingUtils {
  static mapToBadRequest(httpError: HttpErrorResponse): BadRequest | undefined {
    const badRequest: BadRequest = httpError.error;

    return badRequest;
  }
}
