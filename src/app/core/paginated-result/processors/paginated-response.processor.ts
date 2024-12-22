import { HttpResponse } from '@angular/common/http';
import { PaginatedResultFilter } from '../models/paginated-result-filter';
import { PaginatedResultOrder } from '../models/paginated-result-order';
import { PaginatedResult } from '../paginated-result';

/* eslint-disable  @typescript-eslint/no-explicit-any */

interface ResultValue<T> {
  value: T;
}

// Clase auxiliar para procesar las respuestas.
export class PaginatedResponseProcessor {
  private static isPaginatedResult(value: any): value is PaginatedResult<unknown> {
    return (
      typeof value === 'object' &&
      value !== null &&
      'pageNumber' in value &&
      'pageSize' in value &&
      'totalItems' in value
    );
  }

  private static isResultValue(body: any): body is ResultValue<PaginatedResult<unknown>> {
    return (
      Object.hasOwn(body, 'value') &&
      typeof body.value === 'object' &&
      body.value !== null &&
      this.isPaginatedResult(body.value)
    );
  }

  private static parseJsonSafely<T>(jsonString: string, defaultValue: T | undefined): T | undefined {
    try {
      return JSON.parse(jsonString) as T;
    } catch {
      return defaultValue;
    }
  }

  private static processFilters(data: any): PaginatedResultFilter[] | undefined {
    if (!Object.hasOwn(data, 'filters')) {
      return [];
    }

    return typeof data.filters === 'string' && data.filters.length > 0
      ? this.parseJsonSafely<PaginatedResultFilter[]>(data.filters, [])
      : [];
  }

  private static processOrder(data: any): PaginatedResultOrder | undefined {
    if (!Object.hasOwn(data, 'order')) {
      return undefined;
    }

    return typeof data.order === 'string' && data.order.length > 0
      ? this.parseJsonSafely<PaginatedResultOrder>(data.order, undefined)
      : undefined;
  }

  static process(response: HttpResponse<any>): HttpResponse<any> {
    if (!(response.body && typeof response.body === 'object')) {
      return response;
    }

    const body = response.body;

    if (this.isResultValue(body)) {
      // Procesar Result<PaginatedResult>.
      body.value.filters = this.processFilters(body.value) || [];
      body.value.order = this.processOrder(body.value) || undefined;
    } else {
      // Procesar PaginatedResult directamente.
      body.filters = this.processFilters(body) || [];
      body.order = this.processOrder(body) || undefined;
    }

    return response;
  }
}
