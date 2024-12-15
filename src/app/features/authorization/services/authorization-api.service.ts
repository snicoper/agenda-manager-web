import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/api-result/api-result';
import { ApiUrls } from '../../../core/config/api-urls';
import { BaseRoleManagementApiService } from '../../../core/services/api/base-role-management-api.service';
import { CommonUtils } from '../../../core/utils/common-utils';
import { CreateRoleRequest } from '../models/create-role.request';
import { GetRolePermissionsByIdResponse } from '../models/get-role-permissions-by-id.response';
import { RoleResponse } from '../models/role.response';
import { UpdatePermissionForRoleRequest } from '../models/update-permission-for-role.request';
import { RoleUpdateRequest } from '../models/update-role.request';
import { UserInRoleResponse } from '../models/user-in-role.response';
import { UserNotInRoleResponse } from '../models/user-not-in-role.response';

@Injectable({ providedIn: 'root' })
export class AuthorizationApiService extends BaseRoleManagementApiService {
  /** Get roles paginated. */
  getRolesPaginated(apiResult: ApiResult<RoleResponse>): Observable<ApiResult<RoleResponse>> {
    return this.getPaginated(
      apiResult,
      ApiUrls.roles.getRolesPaginated,
      (response) => response.value as ApiResult<RoleResponse>,
    );
  }

  /** Get role by id. */
  getRoleById(roleId: string): Observable<RoleResponse> {
    const endpoint = CommonUtils.buildUrl(ApiUrls.roles.getRoleById, { roleId: roleId });

    return this.get<RoleResponse>(endpoint, (response) => response.value as RoleResponse);
  }

  /** Get role with permissions by id. */
  getRolePermissionsById(roleId: string): Observable<GetRolePermissionsByIdResponse> {
    const endpoint = CommonUtils.buildUrl(ApiUrls.roles.getRolePermissionsById, { roleId: roleId });

    return this.get<GetRolePermissionsByIdResponse>(
      endpoint,
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
    const endpoint = CommonUtils.buildUrl(ApiUrls.roles.updatePermissionForRole, {
      roleId: roleId,
      permissionId: permissionId,
    });

    return this.put<UpdatePermissionForRoleRequest, boolean>(
      request,
      endpoint,
      (response) => response.value as boolean,
    );
  }

  /** Delete role. */
  deleteRole(roleId: string): Observable<boolean> {
    const endpoint = CommonUtils.buildUrl(ApiUrls.roles.deleteRole, { roleId: roleId });

    return this.delete<boolean>(endpoint, (response) => response.value as boolean);
  }

  /** Get users by role id. */
  getUsersByRoleIdPaginated(
    roleId: string,
    apiResult: ApiResult<UserInRoleResponse>,
  ): Observable<ApiResult<UserInRoleResponse>> {
    const endpoint = CommonUtils.buildUrl(ApiUrls.userRoles.getUsersByRoleIdPaginated, { roleId: roleId });

    return this.getPaginated<UserInRoleResponse>(
      apiResult,
      endpoint,
      (response) => response.value as ApiResult<UserInRoleResponse>,
    );
  }

  /** Get users not in role id. */
  getUsersNotInRoleIdPaginated(
    roleId: string,
    apiResult: ApiResult<UserNotInRoleResponse>,
  ): Observable<ApiResult<UserNotInRoleResponse>> {
    const endpoint = CommonUtils.buildUrl(ApiUrls.userRoles.getUsersNotInRoleIdPaginated, { roleId: roleId });

    return this.getPaginated<UserNotInRoleResponse>(
      apiResult,
      endpoint,
      (response) => response.value as ApiResult<UserNotInRoleResponse>,
    );
  }

  /** Update role. */
  updateRole(roleId: string, request: RoleUpdateRequest): Observable<boolean> {
    const endpoint = CommonUtils.buildUrl(ApiUrls.roles.updateRol, { roleId: roleId });

    return this.put<RoleUpdateRequest, boolean>(request, endpoint, (response) => response.value as boolean);
  }
}
