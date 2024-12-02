import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/api-result/api-result';
import { ApiUrls } from '../../../core/config/api-urls';
import { ApiBaseService } from '../../../core/services/api.base.service';
import { CommonUtils } from '../../../core/utils/common-utils';
import { CreateRoleRequest } from '../models/create-role.request';
import { GetRolePermissionsByIdResponse } from '../models/get-role-permissions-by-id.response';
import { RoleResponse } from '../models/role.response';
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
    return this.get<RoleResponse>(ApiUrls.roles.getById, (response) => response.value as RoleResponse);
  }

  /** Get role with permissions by id. */
  getRolePermissionsById(roleId: string): Observable<GetRolePermissionsByIdResponse> {
    const url = CommonUtils.buildUrl(ApiUrls.roles.getRolePermissionsById, { roleId: roleId });

    return this.get<GetRolePermissionsByIdResponse>(
      url,
      (response) => response.value as GetRolePermissionsByIdResponse,
    );
  }

  /** Create role. */
  createRole(request: CreateRoleRequest): Observable<string> {
    return this.post<CreateRoleRequest, string>(
      request,
      ApiUrls.roles.createRole,
      (response) => response.value as string,
    );
  }

  /** Update permission for role. */
  updatePermissionForRole(
    roleId: string,
    permissionId: string,
    request: UpdatePermissionForRoleRequest,
  ): Observable<boolean> {
    const url = CommonUtils.buildUrl(ApiUrls.roles.updatePermissionForRole, {
      roleId: roleId,
      permissionId: permissionId,
    });

    return this.put<UpdatePermissionForRoleRequest, boolean>(request, url, (response) => response.value as boolean);
  }

  /** Delete role. */
  deleteRole(roleId: string): Observable<boolean> {
    const url = CommonUtils.buildUrl(ApiUrls.roles.deleteRole, { roleId: roleId });

    return this.delete<boolean>(url, (response) => response.value as boolean);
  }
}
