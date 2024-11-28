import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Filter } from '../api-result/api-result-item-filter';
import { Order } from '../api-result/api-result-item-order-by';

// Interfaces base para tipar las respuestas
interface ApiResultData {
  [key: string]: unknown;
  filters?: string | Filter[];
  order?: string | Order;
}

interface ApiResultWrapper {
  [key: string]: unknown;
  value?: ApiResultData;
}

@Injectable()
export class ApiResultInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      map((event) => {
        if (!(event instanceof HttpResponse)) {
          return event;
        }

        const body = event.body as ApiResultWrapper | ApiResultData;

        if (!this.isApiResult(body)) {
          return event;
        }

        const transformed =
          'value' in body
            ? { ...body, value: this.transformData(body.value as ApiResultData) }
            : this.transformData(body as ApiResultData);

        return event.clone({ body: transformed });
      }),
    );
  }

  private isApiResult(body: unknown): boolean {
    if (!body || typeof body !== 'object') {
      return false;
    }

    const data = body as ApiResultWrapper;

    return Boolean(
      'filters' in body || 'order' in body || (data.value && ('filters' in data.value || 'order' in data.value)),
    );
  }

  private transformData(data: ApiResultData): ApiResultData {
    return {
      ...data,
      filters: this.parseFilters(data.filters),
      order: this.parseOrder(data.order)?.toString(),
    };
  }

  private parseFilters(filters?: string | Filter[]): Filter[] {
    if (!filters) {
      return [];
    }

    if (Array.isArray(filters)) {
      return filters;
    }

    try {
      return JSON.parse(filters) as Filter[];
    } catch {
      return [];
    }
  }

  private parseOrder(order?: string | Order): Order | null {
    if (!order) {
      return null;
    }

    if (typeof order !== 'string') {
      return order;
    }

    try {
      return JSON.parse(order) as Order;
    } catch {
      return null;
    }
  }
}
