import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppEnvironment } from '../../core/config/app-environment';
import { ApiResponse } from '../models/api-response';

@Injectable({ providedIn: 'root' })
export abstract class ApiService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = AppEnvironment.baseApiUrl;

  get<TResponse>(endpoint = '', mapper?: (data: ApiResponse<TResponse>) => TResponse): Observable<TResponse> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.get<ApiResponse<TResponse>>(url).pipe(map((response) => this.handleResponse(response, mapper)));
  }

  post<TRequest, TResponse>(
    entity: TRequest,
    endpoint = '',
    mapper?: (data: ApiResponse<TResponse>) => TResponse,
  ): Observable<TResponse> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http
      .post<ApiResponse<TResponse>>(url, entity)
      .pipe(map((response) => this.handleResponse(response, mapper)));
  }

  put<TRequest, TResponse>(
    entity: TRequest,
    endpoint = '',
    mapper?: (data: ApiResponse<TResponse>) => TResponse,
  ): Observable<TResponse> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http
      .put<ApiResponse<TResponse>>(url, entity)
      .pipe(map((response) => this.handleResponse(response, mapper)));
  }

  delete<TResponse>(endpoint = '', mapper?: (data: ApiResponse<TResponse>) => TResponse): Observable<TResponse> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.delete<ApiResponse<TResponse>>(url).pipe(map((response) => this.handleResponse(response, mapper)));
  }

  private handleResponse<TResponse>(
    response: ApiResponse<TResponse>,
    mapper?: (data: ApiResponse<TResponse>) => TResponse,
  ): TResponse {
    return mapper ? mapper(response) : response.value;
  }
}
