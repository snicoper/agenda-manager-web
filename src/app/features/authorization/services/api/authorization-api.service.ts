import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { NoContent } from '../../../../core/http/types/no-content.type';
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';
import { BaseRoleManagementApiService } from '../../../../core/services/api/base-role-management-api.service';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { CreateRoleRequest } from '../../models/requests/create-role.request';
import { UpdatePermissionForRoleRequest } from '../../models/requests/update-permission-for-role.request';
import { RoleUpdateRequest } from '../../models/requests/update-role.request';
import { GetRolePermissionsByIdResponse } from '../../models/responses/get-role-permissions-by-id.response';
import { RoleDetailsResponse } from '../../models/responses/role-details.response';
import { RolePaginatedResponse } from '../../models/responses/role-paginated.response';
import { UserInRoleResponse } from '../../models/responses/user-in-role.response';
import { UserNotInRoleResponse } from '../../models/responses/user-not-in-role.response';

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
  getRoleById(roleId: string): Observable<RoleDetailsResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.roles.getRoleById, { roleId: roleId });

    return this.get<RoleDetailsResponse>(endpoint, (response) => response.value as RoleDetailsResponse);
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
  ): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.roles.updatePermissionForRole, {
      roleId: roleId,
      permissionId: permissionId,
    });

    return this.put<UpdatePermissionForRoleRequest, NoContent>(
      request,
      endpoint,
      (response) => response.value as NoContent,
    );
  }

  /** Delete role. */
  deleteRole(roleId: string): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.roles.deleteRole, { roleId: roleId });

    return this.delete<NoContent>(endpoint, (response) => response.value as NoContent);
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
  updateRole(roleId: string, request: RoleUpdateRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.roles.updateRol, { roleId: roleId });

    return this.put<RoleUpdateRequest, NoContent>(request, endpoint, (response) => response.value as NoContent);
  }
}
