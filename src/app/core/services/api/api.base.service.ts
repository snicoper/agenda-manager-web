import { HttpClient, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PaginatedResult } from '../../../shared/paginated-result/paginated-result';
import { ApiResponse } from '../../modules/http/interfaces/api-response.interface';
import { NoContent } from '../../modules/http/types/no-content.type';

/**
 * Clase base abstracta para la comunicación con la API.
 * Proporciona métodos genéricos para realizar operaciones CRUD.
 */
export abstract class ApiBaseService {
  protected readonly http = inject(HttpClient);

  /**
   * Realiza una solicitud GET a un endpoint paginado y transforma la respuesta.
   *
   * @param paginatedResult Estructura de resultados paginados.
   * @param endpoint Endpoint al que se realizará la solicitud.
   * @param mapper Función opcional para transformar la respuesta.
   * @returns Un observable con los resultados paginados transformados.
   */
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

  /**
   * Realiza una solicitud GET a un endpoint y transforma la respuesta.
   *
   * @param endpoint Endpoint al que se realizará la solicitud.
   * @param mapper Función opcional para transformar la respuesta.
   * @returns Un observable con la respuesta transformada.
   */
  protected get<TResponse>(endpoint = '', mapper?: (data: ApiResponse<TResponse>) => TResponse): Observable<TResponse> {
    return this.http
      .get<ApiResponse<TResponse>>(endpoint)
      .pipe(map((response) => this.handleResponse(response, mapper)));
  }

  /**
   * Realiza una solicitud POST a un endpoint y transforma la respuesta.
   *
   * @param request Datos del cuerpo de la solicitud.
   * @param endpoint Endpoint al que se realizará la solicitud.
   * @param mapper Función opcional para transformar la respuesta.
   * @returns Un observable con la respuesta transformada.
   */
  protected post<TRequest, TResponse>(
    request: TRequest,
    endpoint = '',
    mapper?: (data: ApiResponse<TResponse>) => TResponse,
  ): Observable<TResponse> {
    return this.http
      .post<ApiResponse<TResponse>>(endpoint, request)
      .pipe(map((response) => this.handleResponse(response, mapper)));
  }

  /**
   * Realiza una solicitud PUT a un endpoint y transforma la respuesta.
   *
   * @param request Datos del cuerpo de la solicitud.
   * @param endpoint Endpoint al que se realizará la solicitud.
   * @param mapper Función opcional para transformar la respuesta.
   * @returns Un observable con la respuesta transformada.
   */
  protected put<TRequest, TResponse>(
    request: TRequest,
    endpoint = '',
    mapper?: (data: ApiResponse<TResponse>) => TResponse,
  ): Observable<TResponse | NoContent> {
    return this.http.put<ApiResponse<TResponse>>(endpoint, request, { observe: 'response' }).pipe(
      map((response) => {
        return this.handleNoContentResponse(response, mapper);
      }),
    );
  }

  /**
   * Realiza una solicitud DELETE a un endpoint y transforma la respuesta.
   *
   * @param endpoint Endpoint al que se realizará la solicitud.
   * @param mapper Función opcional para transformar la respuesta.
   * @returns Un observable con la respuesta transformada.
   */
  protected delete<TResponse>(
    endpoint = '',
    mapper?: (data: ApiResponse<TResponse>) => TResponse,
  ): Observable<TResponse | NoContent> {
    return this.http
      .delete<ApiResponse<TResponse>>(endpoint, { observe: 'response' })
      .pipe(map((response) => this.handleNoContentResponse(response, mapper)));
  }

  /**
   * Maneja la respuesta de la API y aplica un mapeador opcional.
   *
   * @param response Respuesta de la API.
   * @param mapper Función opcional para transformar la respuesta.
   * @returns La respuesta transformada o el valor original.
   */
  private handleResponse<TResponse>(
    response: ApiResponse<TResponse>,
    mapper?: (data: ApiResponse<TResponse>) => TResponse,
  ): TResponse {
    return mapper ? mapper(response) : response.value;
  }

  /**
   * Maneja la respuesta de la API cuando no hay contenido.
   * @param response Respuesta de la API.
   * @param mapper Función opcional para transformar la respuesta.
   * @returns La respuesta transformada o un valor nulo.
   */
  private handleNoContentResponse<TResponse>(
    response: HttpResponse<ApiResponse<TResponse>>,
    mapper?: (data: ApiResponse<TResponse>) => TResponse,
  ): TResponse | NoContent {
    if (response.status === HttpStatusCode.NoContent) {
      return null;
    }

    return response.body ? this.handleResponse(response.body, mapper) : null;
  }

  /**
   * Construye la URL para una solicitud paginada agregando parámetros de paginación, ordenación y filtros.
   *
   * @param endpoint Endpoint base.
   * @param paginatedResult Resultados paginados con parámetros adicionales.
   * @returns La URL completa con parámetros de consulta.
   */
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

    return `${endpoint}?${params.toString()}`;
  }
}
