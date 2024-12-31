import { Signal } from '@angular/core';

export interface RoleSelectedState {
  roleId: Signal<string | null>;
  role: Signal<RoleDetailsResponse | null>;
  loading: Signal<boolean>;
}
