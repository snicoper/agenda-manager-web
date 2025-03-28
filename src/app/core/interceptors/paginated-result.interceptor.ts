import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { PaginatedResponseProcessor } from '../modules/paginated-result/processors/paginated-response.processor';
import { Injectable } from '@angular/core';

@Injectable()
export class PaginatedResultInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      map((event) => {
        if (event instanceof HttpResponse && event.status === HttpStatusCode.Ok) {
          return PaginatedResponseProcessor.process(event);
        }

        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
}
