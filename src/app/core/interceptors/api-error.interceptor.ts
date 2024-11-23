import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { logObject } from '../errors/log-messages';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  private readonly router = inject(Router);

  /** Handle error de la aplicación. */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            return this.handleUnauthorized(request, next);
          case HttpStatusCode.NotFound:
            this.handleNotFound(error);
            break;
          case HttpStatusCode.Forbidden:
            this.handleForbidden();
            break;
          case HttpStatusCode.BadRequest:
          case HttpStatusCode.Conflict:
            this.handleBadRequest(error);
            break;
          case HttpStatusCode.NoContent:
            break;
          default:
            this.handleUnknownError();
        }

        return throwError(() => error);
      }),
    );
  }

  /** Manejar error Unauthorized. */
  private handleUnauthorized(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request);
  }

  /** Manejar error NotFound. */
  private handleNotFound(error: HttpErrorResponse): void {
    logObject(error);
  }

  /** Manejar error Forbidden.  */
  private handleForbidden(): void {
    // ...
  }

  /** Manejar error BadRequest. */
  private handleBadRequest(error: HttpErrorResponse): void {
    logObject(error);
  }

  /** Errores 500. */
  private handleUnknownError(): void {
    // ...
  }
}
