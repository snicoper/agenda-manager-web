import { Observable } from 'rxjs';
import { UrlUtils } from '../../../shared/utils/url/url.utils';
import { ApiUrls } from '../../config/api-urls';
import { NoContent } from '../../modules/http/types/no-content.type';
import { ApiBaseService } from './api.base.service';

/**
 * Role management API service.
 *
 * Used to manage roles and permissions in the system.
 */
export class BaseRoleManagementApiService extends ApiBaseService {
  /** Assign user to role. */
  assignUserToRole(roleId: string, userId: string): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.userRoles.assignUserToRole, {
      roleId: roleId,
      userId: userId,
    });

    return this.put<boolean, NoContent>(true, endpoint, (response) => response.value as NoContent);
  }

  /** Unassigned user from role. */
  unAssignedUserFromRole(roleId: string, userId: string): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.userRoles.unAssignedUserFromRole, {
      roleId: roleId,
      userId: userId,
    });

    return this.delete<NoContent>(endpoint, (response) => response.value as NoContent);
  }
}
