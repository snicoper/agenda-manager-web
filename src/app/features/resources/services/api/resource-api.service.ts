import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';
import { ApiBaseService } from '../../../../core/services/api/api.base.service';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { ResourceCreateRequest } from '../../models/requests/resource-create.request';
import { ResourceCreateResponse } from '../../models/responses/resource-create.response';
import { ResourceDetailsResponse } from '../../models/responses/resource-details.response';
import { ResourcePaginatedResponse } from '../../models/responses/resource-paginated.response';

@Injectable({ providedIn: 'root' })
export class ResourceApiService extends ApiBaseService {
  /** Get a paginated list of resource. */
  getResourcesPaginated(
    paginatedResult: PaginatedResult<ResourcePaginatedResponse>,
  ): Observable<PaginatedResult<ResourcePaginatedResponse>> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resources.getResourcesPaginated);

    return this.getPaginated(paginatedResult, endpoint, (response) => {
      const result = PaginatedResult.create<ResourcePaginatedResponse>(response.value);

      result.items = result.items.map((resource) => ({
        ...resource,
        createdAt: DateTimeUtils.fromApi(resource.createdAt) as DateTime,
      }));

      return result;
    });
  }

  /** Get a resource by id. */
  getResourceById(resourceId: string): Observable<ResourceDetailsResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resources.getResourceById, { id: resourceId });

    return this.get<ResourceDetailsResponse>(endpoint).pipe(
      map((response) => ({
        ...response,
        createdAt: DateTimeUtils.fromApi(response.createdAt) as DateTime,
      })),
    );
  }

  /** Create a resource. */
  createResource(request: ResourceCreateRequest): Observable<ResourceCreateResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resources.createResource);

    return this.post<ResourceCreateRequest, ResourceCreateResponse>(
      request,
      endpoint,
      (response) => response.value as ResourceCreateResponse,
    );
  }
}
