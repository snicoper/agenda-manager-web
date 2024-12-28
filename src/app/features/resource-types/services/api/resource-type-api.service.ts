import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { ApiBaseService } from '../../../../core/services/api/api.base.service';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { ResourceTypeCreateRequest } from '../../interfaces/requests/resource-type-create.request';
import { ResourceTypeCreateResponse } from '../../interfaces/responses/resource-type-create.response';
import { ResourceTypePaginatedResponse } from '../../interfaces/responses/resource-type-paginated.response';
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';

@Injectable({ providedIn: 'root' })
export class ResourceTypeApiService extends ApiBaseService {
  /** Obtener lista paginada de tipo de recursos. */
  getResourceTypesPaginated(
    paginatedResult: PaginatedResult<ResourceTypePaginatedResponse>,
  ): Observable<PaginatedResult<ResourceTypePaginatedResponse>> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resourceTypes.getResourceTypesPaginated);

    return this.getPaginated(
      paginatedResult,
      endpoint,
      (response) => response.value as PaginatedResult<ResourceTypePaginatedResponse>,
    );
  }

  /** Crear un nuevo tipo de recurso. */
  createResourceType(request: ResourceTypeCreateRequest): Observable<ResourceTypeCreateResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resourceTypes.createResourceType);

    return this.post<ResourceTypeCreateRequest, ResourceTypeCreateResponse>(
      request,
      endpoint,
      (response) => response.value as ResourceTypeCreateResponse,
    );
  }
}
