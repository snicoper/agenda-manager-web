import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AppEnvironment } from '../../config/app-environment';
import { logError } from '../../errors/debug-logger';
import { ApiResponseProcessor } from '../processors/api-response.proccesor';

@Injectable()
export class ApiResultInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      map((event) => {
        if (event instanceof HttpResponse && event.status === HttpStatusCode.Ok) {
          return ApiResponseProcessor.process(event);
        }

        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (AppEnvironment.IsDebug) {
          logError('Error en ApiResultInterceptor:', error);
        }

        return throwError(() => error);
      }),
    );
  }
}
