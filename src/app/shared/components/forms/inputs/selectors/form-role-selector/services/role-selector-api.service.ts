import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../../../../core/config/api-urls';
import { ApiBaseService } from '../../../../../../../core/services/api/api.base.service';
import { SelectableRole } from '../models/selectable-role';

@Injectable()
export class RoleSelectorApiService extends ApiBaseService {
  /** Get all roles. */
  getAllRoles(): Observable<SelectableRole[]> {
    return this.get<SelectableRole[]>(ApiUrls.roles.getAllRoles, (response) => response.value as SelectableRole[]);
  }
}
