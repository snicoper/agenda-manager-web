import { Observable } from 'rxjs';
import { UrlUtils } from '../../../shared/utils/url/url.utils';
import { ApiUrls } from '../../config/api-urls';
import { ApiBaseService } from './api.base.service';

/**
 * Role management API service.
 *
 * Used to manage roles and permissions in the system.
 */
export class BaseRoleManagementApiService extends ApiBaseService {
  /** Assign user to role. */
  assignUserToRole(roleId: string, userId: string): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.userRoles.assignUserToRole, {
      roleId: roleId,
      userId: userId,
    });

    return this.post<boolean, boolean>(true, endpoint, (response) => response.value as boolean);
  }

  /** Unassigned user from role. */
  unAssignedUserFromRole(roleId: string, userId: string): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.userRoles.unAssignedUserFromRole, {
      roleId: roleId,
      userId: userId,
    });

    return this.delete<boolean>(endpoint, (response) => response.value as boolean);
  }
}
