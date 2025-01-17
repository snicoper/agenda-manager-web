import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { EmptyRequest } from '../../../../core/http/types/empty-request.type';
import { NoContent } from '../../../../core/http/types/no-content.type';
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';
import { ApiBaseService } from '../../../../core/services/api/api.base.service';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { DeactivateResourceRequest } from '../../models/requests/deactivate-resource.request';
import { ResourceCreateRequest } from '../../models/requests/resource-create.request';
import { ResourceUpdateRequest } from '../../models/requests/resource-update.request';
import { ResourceCreateResponse } from '../../models/responses/resource-create.response';
import { ResourceDetailsResponse } from '../../models/responses/resource-details.response';
import { ResourcePaginatedResponse } from '../../models/responses/resource-paginated.response';
import { ResourceScheduleResponse } from '../../models/responses/resource-schedule.response';

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
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resources.getResourceById, { resourceId: resourceId });

    return this.get<ResourceDetailsResponse>(endpoint).pipe(
      map((response) => ({
        ...response,
        createdAt: DateTimeUtils.fromApi(response.createdAt) as DateTime,
      })),
    );
  }

  /** Get a list of schedules by resource id. */
  getSchedulesByResourceId(resourceId: string): Observable<ResourceScheduleResponse[]> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resources.getSchedulesByResourceId, { resourceId: resourceId });

    return this.get<ResourceScheduleResponse[]>(endpoint, (response) => response.value as ResourceScheduleResponse[]);
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

  /** Deactivate a resource. */
  deactivateResource(resourceId: string, request: DeactivateResourceRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resources.deactivateResource, { resourceId: resourceId });

    return this.put<DeactivateResourceRequest, NoContent>(request, endpoint, (response) => response.value as NoContent);
  }

  /** Activate a resource. */
  activateResource(resourceId: string): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resources.activateResource, { resourceId: resourceId });

    return this.put<EmptyRequest, NoContent>({}, endpoint, (response) => response.value as NoContent);
  }

  /** Update a resource. */
  updateResource(resourceId: string, request: ResourceUpdateRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resources.updateResource, { resourceId: resourceId });

    return this.put<ResourceUpdateRequest, NoContent>(request, endpoint, (response) => response.value as NoContent);
  }

  /** Delete a resource. */
  deleteResource(resourceId: string): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resources.deleteResource, { resourceId: resourceId });

    return this.delete<NoContent>(endpoint, (response) => response.value as NoContent);
  }
}
