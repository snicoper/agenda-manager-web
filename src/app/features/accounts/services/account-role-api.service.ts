import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../core/config/api-urls';
import { ApiBaseService } from '../../../core/services/api.base.service';
import { CommonUtils } from '../../../core/utils/common-utils';
import { AccountRoleByUserIdResponse } from '../models/account-role-by-user-id.response';
import { AvailableRolesByUserIdResponse } from '../models/available-roles-by-user-id.response';

@Injectable({ providedIn: 'root' })
export class AccountRoleApiService extends ApiBaseService {
  /** Get user roles by userId. */
  getUserRolesByUserId(userId: string): Observable<AccountRoleByUserIdResponse[]> {
    const endpoint = CommonUtils.buildUrl(ApiUrls.userRoles.getRolesByUserId, { userId: userId });

    return this.get<AccountRoleByUserIdResponse[]>(
      endpoint,
      (response) => response.value as AccountRoleByUserIdResponse[],
    );
  }

  /** Get available roles by userId. */
  getAvailableRolesByUserId(userId: string): Observable<AvailableRolesByUserIdResponse[]> {
    const endpoint = CommonUtils.buildUrl(ApiUrls.userRoles.getAvailableRolesByUserId, { userId: userId });

    return this.get<AvailableRolesByUserIdResponse[]>(
      endpoint,
      (response) => response.value as AvailableRolesByUserIdResponse[],
    );
  }

  /** Assign user to role. */
  assignUserToRole(roleId: string, userId: string): Observable<boolean> {
    const endpoint = CommonUtils.buildUrl(ApiUrls.userRoles.assignUserToRole, {
      roleId: roleId,
      userId: userId,
    });

    return this.post<boolean, boolean>(true, endpoint, (response) => response.value as boolean);
  }

  /** Unassigned user from role. */
  unAssignedUserFromRole(roleId: string, userId: string): Observable<boolean> {
    const endpoint = CommonUtils.buildUrl(ApiUrls.userRoles.unAssignedUserFromRole, {
      roleId: roleId,
      userId: userId,
    });

    return this.delete<boolean>(endpoint, (response) => response.value as boolean);
  }
}
