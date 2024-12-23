import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { BaseRoleManagementApiService } from '../../../../core/services/api/base-role-management-api.service';
import { PaginatedResult } from '../../../../shared/paginated-result/paginated-result';
import { UrlUtils } from '../../../../shared/utils/url/url.utils';
import { CreateRoleRequest } from '../../models/create-role.request';
import { GetRolePermissionsByIdResponse } from '../../models/get-role-permissions-by-id.response';
import { RolePaginatedResponse } from '../../models/role-paginated.response';
import { RoleResponse } from '../../models/role.response';
import { UpdatePermissionForRoleRequest } from '../../models/update-permission-for-role.request';
import { RoleUpdateRequest } from '../../models/update-role.request';
import { UserInRoleResponse } from '../../models/user-in-role.response';
import { UserNotInRoleResponse } from '../../models/user-not-in-role.response';

@Injectable({ providedIn: 'root' })
export class AuthorizationApiService extends BaseRoleManagementApiService {
  /** Get roles paginated. */
  getRolesPaginated(
    paginatedResult: PaginatedResult<RolePaginatedResponse>,
  ): Observable<PaginatedResult<RolePaginatedResponse>> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.roles.getRolesPaginated);

    return this.getPaginated(
      paginatedResult,
      endpoint,
      (response) => response.value as PaginatedResult<RolePaginatedResponse>,
    );
  }

  /** Get role by id. */
  getRoleById(roleId: string): Observable<RoleResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.roles.getRoleById, { roleId: roleId });

    return this.get<RoleResponse>(endpoint, (response) => response.value as RoleResponse);
  }

  /** Get role with permissions by id. */
  getRolePermissionsById(roleId: string): Observable<GetRolePermissionsByIdResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.roles.getRolePermissionsById, { roleId: roleId });

    return this.get<GetRolePermissionsByIdResponse>(
      endpoint,
      (response) => response.value as GetRolePermissionsByIdResponse,
    );
  }

  /** Create role. */
  createRole(request: CreateRoleRequest): Observable<string> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.roles.createRole);

    return this.post<CreateRoleRequest, string>(request, endpoint, (response) => response.value as string);
  }

  /** Update permission for role. */
  updatePermissionForRole(
    roleId: string,
    permissionId: string,
    request: UpdatePermissionForRoleRequest,
  ): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.roles.updatePermissionForRole, {
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
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.roles.deleteRole, { roleId: roleId });

    return this.delete<boolean>(endpoint, (response) => response.value as boolean);
  }

  /** Get users by role id. */
  getUsersByRoleIdPaginated(
    roleId: string,
    paginatedResult: PaginatedResult<UserInRoleResponse>,
  ): Observable<PaginatedResult<UserInRoleResponse>> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.userRoles.getUsersByRoleIdPaginated, { roleId: roleId });

    return this.getPaginated<UserInRoleResponse>(
      paginatedResult,
      endpoint,
      (response) => response.value as PaginatedResult<UserInRoleResponse>,
    );
  }

  /** Get users not in role id. */
  getUsersNotInRoleIdPaginated(
    roleId: string,
    paginatedResult: PaginatedResult<UserNotInRoleResponse>,
  ): Observable<PaginatedResult<UserNotInRoleResponse>> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.userRoles.getUsersNotInRoleIdPaginated, { roleId: roleId });

    return this.getPaginated<UserNotInRoleResponse>(
      paginatedResult,
      endpoint,
      (response) => response.value as PaginatedResult<UserNotInRoleResponse>,
    );
  }

  /** Update role. */
  updateRole(roleId: string, request: RoleUpdateRequest): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.roles.updateRol, { roleId: roleId });

    return this.put<RoleUpdateRequest, boolean>(request, endpoint, (response) => response.value as boolean);
  }
}
