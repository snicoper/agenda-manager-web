import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/api-result/api-result';
import { ApiUrls } from '../../../core/config/api-urls';
import { ApiBaseService } from '../../../core/services/api.base.service';
import { RoleResponse } from '../models/role.response';

@Injectable({ providedIn: 'root' })
export class AuthorizationApiService extends ApiBaseService {
  /** Get roles paginated. */
  getRolesPaginated(apiResult: ApiResult<RoleResponse>): Observable<ApiResult<RoleResponse>> {
    return this.getPaginated(
      apiResult,
      ApiUrls.roles.getPaginated,
      (response) => response.value as ApiResult<RoleResponse>,
    );
  }

  /** Get role by id. */
  getRoleById(): Observable<RoleResponse> {
    return this.get<RoleResponse>(ApiUrls.roles.getById, (response) => response.value);
  }
}
