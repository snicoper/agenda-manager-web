import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { ApiBaseService } from '../../../../core/services/api/api.base.service';
import { PaginatedResult } from '../../../../shared/paginated-result/paginated-result';
import { UrlUtils } from '../../../../shared/utils/url/url.utils';
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
}
