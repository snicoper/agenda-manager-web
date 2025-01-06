import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';
import { ApiBaseService } from '../../../../core/services/api/api.base.service';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
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
}
