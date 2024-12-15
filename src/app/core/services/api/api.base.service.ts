import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResult } from '../../api-result/api-result';
import { AppEnvironment } from '../../config/app-environment';
import { ApiResponse } from '../../models/api.response';

export abstract class ApiBaseService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = AppEnvironment.BaseApiUrl;

  protected getPaginated<T>(
    apiResult: ApiResult<T>,
    endpoint = '',
    mapper?: (data: ApiResponse<ApiResult<T>>) => ApiResult<T>,
  ): Observable<ApiResult<T>> {
    const url = this.buildPaginatedUrl(endpoint, apiResult);

    return this.http.get<ApiResponse<ApiResult<T>>>(url).pipe(map((response) => this.handleResponse(response, mapper)));
  }

  protected get<TResponse>(endpoint = '', mapper?: (data: ApiResponse<TResponse>) => TResponse): Observable<TResponse> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.get<ApiResponse<TResponse>>(url).pipe(map((response) => this.handleResponse(response, mapper)));
  }

  protected post<TRequest, TResponse>(
    request: TRequest,
    endpoint = '',
    mapper?: (data: ApiResponse<TResponse>) => TResponse,
  ): Observable<TResponse> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http
      .post<ApiResponse<TResponse>>(url, request)
      .pipe(map((response) => this.handleResponse(response, mapper)));
  }

  protected put<TRequest, TResponse>(
    request: TRequest,
    endpoint = '',
    mapper?: (data: ApiResponse<TResponse>) => TResponse,
  ): Observable<TResponse> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http
      .put<ApiResponse<TResponse>>(url, request)
      .pipe(map((response) => this.handleResponse(response, mapper)));
  }

  protected delete<TResponse>(
    endpoint = '',
    mapper?: (data: ApiResponse<TResponse>) => TResponse,
  ): Observable<TResponse> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.delete<ApiResponse<TResponse>>(url).pipe(map((response) => this.handleResponse(response, mapper)));
  }

  private handleResponse<TResponse>(
    response: ApiResponse<TResponse>,
    mapper?: (data: ApiResponse<TResponse>) => TResponse,
  ): TResponse {
    return mapper ? mapper(response) : response.value;
  }

  private buildPaginatedUrl<T>(endpoint: string, apiResult: ApiResult<T>): string {
    const params = new URLSearchParams();

    // Parámetros de paginación
    params.append('pageNumber', apiResult.pageNumber.toString());
    params.append('pageSize', apiResult.pageSize.toString());

    // Ordenación
    if (apiResult.order) {
      params.append('order', JSON.stringify(apiResult.order));
    }

    // Filtros
    if (apiResult.filters.length > 0) {
      params.append('filters', JSON.stringify(apiResult.filters));
    }

    return `${this.baseUrl}${endpoint}?${params.toString()}`;
  }
}
