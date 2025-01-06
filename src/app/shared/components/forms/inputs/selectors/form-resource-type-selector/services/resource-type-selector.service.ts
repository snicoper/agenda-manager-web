import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../../../../core/config/api-urls';
import { ApiBaseService } from '../../../../../../../core/services/api/api.base.service';
import { UrlUtils } from '../../../../../../../core/utils/url/url.utils';
import { SelectableResourceType } from '../models/selectable-resource-type.model';

@Injectable()
export class ResourceTypeSelectorService extends ApiBaseService {
  /** Get all resource types. */
  getAllResourceTypes(): Observable<SelectableResourceType[]> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.resourceTypes.getResourceTypes);

    return this.get<SelectableResourceType[]>(endpoint, (response) => response.value as SelectableResourceType[]);
  }
}
