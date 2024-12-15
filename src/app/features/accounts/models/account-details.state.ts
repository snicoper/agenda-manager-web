import { Signal } from '@angular/core';
import { AccountDetailsResponse } from './account-details.response';

export interface AccountDetailsState {
  userId: Signal<string | null>;
  account: Signal<AccountDetailsResponse | null>;
  loading: Signal<boolean>;
}
