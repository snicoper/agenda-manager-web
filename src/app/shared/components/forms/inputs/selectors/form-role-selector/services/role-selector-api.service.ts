import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../../../../core/config/api-urls';
import { ApiBaseService } from '../../../../../../../core/services/api/api.base.service';
import { UrlUtils } from '../../../../../../utils/url/url.utils';
import { SelectableRole } from '../models/selectable-role';

@Injectable()
export class RoleSelectorApiService extends ApiBaseService {
  /** Get all roles. */
  getAllRoles(): Observable<SelectableRole[]> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.roles.getAllRoles);

    return this.get<SelectableRole[]>(endpoint, (response) => response.value as SelectableRole[]);
  }
}
