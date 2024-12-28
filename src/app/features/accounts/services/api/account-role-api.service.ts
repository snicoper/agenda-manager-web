import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { BaseRoleManagementApiService } from '../../../../core/services/api/base-role-management-api.service';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { AccountRoleByUserIdResponse } from '../../interfaces/responses/account-role-by-user-id.response';
import { AvailableRolesByUserIdResponse } from '../../interfaces/responses/available-roles-by-user-id.response';

@Injectable({ providedIn: 'root' })
export class AccountRoleApiService extends BaseRoleManagementApiService {
  /** Get user roles by userId. */
  getUserRolesByUserId(userId: string): Observable<AccountRoleByUserIdResponse[]> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.userRoles.getRolesByUserId, { userId: userId });

    return this.get<AccountRoleByUserIdResponse[]>(
      endpoint,
      (response) => response.value as AccountRoleByUserIdResponse[],
    );
  }

  /** Get available roles by userId. */
  getAvailableRolesByUserId(userId: string): Observable<AvailableRolesByUserIdResponse[]> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.userRoles.getAvailableRolesByUserId, { userId: userId });

    return this.get<AvailableRolesByUserIdResponse[]>(
      endpoint,
      (response) => response.value as AvailableRolesByUserIdResponse[],
    );
  }
}
