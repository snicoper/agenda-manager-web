import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/api-result/api-result';
import { ApiUrls } from '../../../core/config/api-urls';
import { ApiBaseService } from '../../../core/services/api.base.service';
import { DateTimeUtils } from '../../../core/utils/datetime-utils';
import { AccountResponse } from '../models/account.response';
import { ConfirmEmailResentRequest } from '../models/confirm-email-resent.request';
import { ConfirmEmailVerifyRequest } from '../models/confirm-email-verify.request';
import { RecoveryConfirmPasswordRequest } from '../models/recovery-confirm-password.request';
import { RecoveryPasswordRequest } from '../models/recovery-password.request';

@Injectable({ providedIn: 'root' })
export class AccountApiService extends ApiBaseService {
  /** Get a paginated list of accounts. */
  getAccountsPaginated(apiResult: ApiResult<AccountResponse>): Observable<ApiResult<AccountResponse>> {
    return this.getPaginated(apiResult, ApiUrls.accounts.getAccountsPaginated, (response) => {
      const result = ApiResult.create<AccountResponse>(response.value);

      result.items = result.items.map((account) => ({
        ...account,
        dateJoined: DateTimeUtils.fromApi(account.dateJoined),
      }));

      return result;
    });
  }

  /** Recovery password. */
  recoveryPassword(request: RecoveryPasswordRequest): Observable<boolean> {
    return this.post<RecoveryPasswordRequest, boolean>(
      request,
      ApiUrls.accounts.recoveryPassword,
      (response) => response.isSuccess,
    );
  }

  /** Confirm recovery password. */
  confirmRecoveryPassword(request: RecoveryConfirmPasswordRequest): Observable<boolean> {
    return this.post<RecoveryConfirmPasswordRequest, boolean>(
      request,
      ApiUrls.accounts.confirmRecoveryPassword,
      (response) => response.isSuccess,
    );
  }

  /** Resend email code. */
  confirmEmailResent(request: ConfirmEmailResentRequest): Observable<boolean> {
    return this.post<ConfirmEmailResentRequest, boolean>(
      request,
      ApiUrls.accounts.confirmEmailResent,
      (response) => response.isSuccess,
    );
  }

  /** Verify email. */
  confirmEmailVerify(request: ConfirmEmailVerifyRequest): Observable<boolean> {
    return this.post<ConfirmEmailVerifyRequest, boolean>(
      request,
      ApiUrls.accounts.confirmEmailVerify,
      (response) => response.isSuccess,
    );
  }
}
