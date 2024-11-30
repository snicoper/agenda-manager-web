import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/api-result/api-result';
import { ApiUrls } from '../../../core/config/api-urls';
import { ApiBaseService } from '../../../core/services/api.base.service';
import { RoleResponse } from '../models/role.response';
import { RoleWithPermissionAvailabilityByIdResponse } from '../models/roleWithPermissionAvailabilityById.response';
import { UpdatePermissionForRoleRequest } from '../models/update-permission-for-role.request';

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

  /** Get role with permission availability by id. */
  getRoleWithPermissionAvailabilityById(roleId: string): Observable<RoleWithPermissionAvailabilityByIdResponse> {
    const url = ApiUrls.roles.getRoleWithPermissionAvailabilityById.replace('{roleId}', roleId);

    return this.get<RoleWithPermissionAvailabilityByIdResponse>(url, (response) => response.value);
  }

  /** Update permission for role. */
  updatePermissionForRole(
    roleId: string,
    permissionId: string,
    request: UpdatePermissionForRoleRequest,
  ): Observable<boolean> {
    const url = ApiUrls.roles.updatePermissionForRole
      .replace('{roleId}', roleId)
      .replace('{permissionId}', permissionId);

    return this.put<UpdatePermissionForRoleRequest, boolean>(request, url, (response) => response.value);
  }
}
