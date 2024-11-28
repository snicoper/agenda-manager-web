import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResultItemFilter } from '../api-result/api-result-item-filter';
import { ApiResultItemOrderBy } from '../api-result/api-result-item-order-by';

/* eslint-disable  @typescript-eslint/no-explicit-any */

/** Comprueba si es un ApiResult y deserializa filters. */
@Injectable()
export class ApiResultInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      map((event) => {
        if (event instanceof HttpResponse && event.status === HttpStatusCode.Ok) {
          event = this.apiResultOrder(event);
          event = this.apiResultFilter(event);
        }

        return event;
      }),
    );
  }

  private apiResultFilter(event: HttpResponse<any>): HttpResponse<any> {
    // Filtros de ResultValue<ApiResult>.
    if (
      Object.hasOwn(event.body, 'value') &&
      Object.hasOwn(event.body.value, 'filters') &&
      event.body.value.filters.length
    ) {
      event.body.value.filters = JSON.parse(event.body.value.filters) as ApiResultItemFilter[];

      return event;
    } else if (Object.hasOwn(event.body, 'value') && Object.hasOwn(event.body.value, 'filters')) {
      event.body.value.filters = [] as ApiResultItemFilter[];

      return event;
    }

    // Filtros de ApiResult.
    if (Object.hasOwn(event.body, 'filters') && event.body.filters.length) {
      event.body.filters = JSON.parse(event.body.filters) as ApiResultItemFilter[];
    } else if (Object.hasOwn(event.body, 'filters')) {
      event.body.filters = [] as ApiResultItemFilter[];
    }

    return event;
  }

  private apiResultOrder(event: HttpResponse<any>): HttpResponse<any> {
    // Order de ResultValue<ApiResult>.
    if (
      Object.hasOwn(event.body, 'value') &&
      Object.hasOwn(event.body.value, 'order') &&
      event.body.value.order.length
    ) {
      event.body.value.order = JSON.parse(event.body.value.order) as ApiResultItemOrderBy;

      return event;
    } else if (Object.hasOwn(event.body, 'value') && Object.hasOwn(event.body.value, 'order')) {
      event.body.value.order = '';

      return event;
    }

    // Order de ApiResult.
    if (Object.hasOwn(event.body, 'order') && event.body.order.length) {
      event.body.order = JSON.parse(event.body.order) as ApiResultItemOrderBy;
    } else if (Object.hasOwn(event.body, 'order')) {
      event.body.order = '';
    }

    return event;
  }
}
