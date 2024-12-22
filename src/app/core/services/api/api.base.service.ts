import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppEnvironment } from '../../config/app-environment';
import { ApiResponse } from '../../models/api-response.interface';
import { PaginatedResult } from '../../paginated-result/paginated-result';

export abstract class ApiBaseService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = AppEnvironment.BaseApiUrl;

  protected getPaginated<T>(
    paginatedResult: PaginatedResult<T>,
    endpoint = '',
    mapper?: (data: ApiResponse<PaginatedResult<T>>) => PaginatedResult<T>,
  ): Observable<PaginatedResult<T>> {
    const url = this.buildPaginatedUrl(endpoint, paginatedResult);

    return this.http
      .get<ApiResponse<PaginatedResult<T>>>(url)
      .pipe(map((response) => this.handleResponse(response, mapper)));
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

  private buildPaginatedUrl<T>(endpoint: string, paginatedResult: PaginatedResult<T>): string {
    const params = new URLSearchParams();

    // Parámetros de paginación.
    params.append('pageNumber', paginatedResult.pageNumber.toString());
    params.append('pageSize', paginatedResult.pageSize.toString());

    // Ordenación.
    if (paginatedResult.order) {
      params.append('order', JSON.stringify(paginatedResult.order));
    }

    // Filtros.
    if (paginatedResult.filters.length > 0) {
      params.append('filters', JSON.stringify(paginatedResult.filters));
    }

    return `${this.baseUrl}${endpoint}?${params.toString()}`;
  }
}
