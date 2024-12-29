import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { NoContent } from '../../../../core/http/types/no-content.type';
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';
import { ApiBaseService } from '../../../../core/services/api/api.base.service';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { ResourceTypeCreateRequest } from '../../interfaces/requests/resource-type-create.request';
import { ResourceTypeCreateResponse } from '../../interfaces/responses/resource-type-create.response';
import { ResourceTypePaginatedResponse } from '../../interfaces/responses/resource-type-paginated.response';

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

  /** Eliminar un tipo de recurso. */
  deleteResourceType(resourceTypeId: string): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resourceTypes.deleteResourceType, { resourceTypeId });

    return this.delete<NoContent>(endpoint, (response) => response.value as NoContent);
  }
}
