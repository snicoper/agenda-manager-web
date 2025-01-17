import { Signal } from '@angular/core';
import { AccountDetailsResponse } from '../responses/account-details.response';

export interface AccountSelectedState {
  userId: Signal<string | null>;
  account: Signal<AccountDetailsResponse | null>;
  isLoading: Signal<boolean>;
}
