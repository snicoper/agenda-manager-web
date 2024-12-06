import { HttpResponse } from '@angular/common/http';
import { ApiResult } from '../api-result';
import { ApiResultFilter } from '../models/api-result-filter';
import { ApiResultOrder } from '../models/api-result-order';

/* eslint-disable  @typescript-eslint/no-explicit-any */

interface ResultValue<T> {
  value: T;
}

// Clase auxiliar para procesar las respuestas.
export class ApiResponseProcessor {
  private static isApiResult(value: any): value is ApiResult<unknown> {
    return (
      typeof value === 'object' &&
      value !== null &&
      'pageNumber' in value &&
      'pageSize' in value &&
      'totalItems' in value
    );
  }

  private static isResultValue(body: any): body is ResultValue<ApiResult<unknown>> {
    return (
      Object.hasOwn(body, 'value') &&
      typeof body.value === 'object' &&
      body.value !== null &&
      this.isApiResult(body.value)
    );
  }

  private static parseJsonSafely<T>(jsonString: string, defaultValue: T | undefined): T | undefined {
    try {
      return JSON.parse(jsonString) as T;
    } catch {
      return defaultValue;
    }
  }

  private static processFilters(data: any): ApiResultFilter[] | undefined {
    if (!Object.hasOwn(data, 'filters')) {
      return [];
    }

    return typeof data.filters === 'string' && data.filters.length > 0
      ? this.parseJsonSafely<ApiResultFilter[]>(data.filters, [])
      : [];
  }

  private static processOrder(data: any): ApiResultOrder | undefined {
    if (!Object.hasOwn(data, 'order')) {
      return undefined;
    }

    return typeof data.order === 'string' && data.order.length > 0
      ? this.parseJsonSafely<ApiResultOrder>(data.order, undefined)
      : undefined;
  }

  static process(response: HttpResponse<any>): HttpResponse<any> {
    if (!(response.body && typeof response.body === 'object')) {
      return response;
    }

    const body = response.body;

    if (this.isResultValue(body)) {
      // Procesar Result<ApiResult>.
      body.value.filters = this.processFilters(body.value) || [];
      body.value.order = this.processOrder(body.value) || undefined;
    } else {
      // Procesar ApiResult directamente.
      body.filters = this.processFilters(body) || [];
      body.order = this.processOrder(body) || undefined;
    }

    return response;
  }
}
