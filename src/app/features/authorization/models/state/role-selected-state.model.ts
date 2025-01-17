import { Signal } from '@angular/core';
import { RoleDetailsResponse } from '../responses/role-details.response';

export interface RoleSelectedState {
  roleId: Signal<string | null>;
  role: Signal<RoleDetailsResponse | null>;
  isLoading: Signal<boolean>;
}
