import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/api-result/api-result';
import { ApiUrls } from '../../../core/config/api-urls';
import { ApiBaseService } from '../../../core/services/api.base.service';
import { CommonUtils } from '../../../core/utils/common-utils';
import { DateTimeUtils } from '../../../core/utils/datetime-utils';
import { AccountCreateRequest } from '../models/account-create.request';
import { AccountCreateResponse } from '../models/account-create.response';
import { AccountDetailsResponse } from '../models/account-details.response';
import { AccountResponse } from '../models/account.response';
import { ConfirmAccountRequest } from '../models/confirm-account.request';
import { RequestPasswordResetRequest } from '../models/request-password-reset.request';
import { ResendEmailConfirmation } from '../models/resend-email-confirmation.request';
import { ResetPasswordRequest } from '../models/reset-password.request';
import { VerifyEmailRequest } from '../models/verify-email.request';

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

  /** Get account details. */
  getAccountDetails(userId: string): Observable<AccountDetailsResponse> {
    const endpoint = CommonUtils.buildUrl(ApiUrls.accounts.getAccountDetails, { userId: userId });

    return this.get<AccountDetailsResponse>(endpoint, (response) => {
      return {
        ...response.value,
        createAt: DateTimeUtils.fromApi(response.value.createdAt),
      };
    });
  }

  /** Create account. */
  createAccount(request: AccountCreateRequest): Observable<AccountCreateResponse> {
    return this.post<AccountCreateRequest, AccountCreateResponse>(
      request,
      ApiUrls.accounts.createAccount,
      (response) => response.value as AccountCreateResponse,
    );
  }

  /** Account confirmation. */
  confirmAccount(request: ConfirmAccountRequest): Observable<boolean> {
    return this.post<ConfirmAccountRequest, boolean>(
      request,
      ApiUrls.accounts.confirmAccount,
      (response) => response.isSuccess,
    );
  }

  /** Recovery password. */
  requestPasswordReset(request: RequestPasswordResetRequest): Observable<boolean> {
    return this.post<RequestPasswordResetRequest, boolean>(
      request,
      ApiUrls.accounts.requestPasswordReset,
      (response) => response.isSuccess,
    );
  }

  /** Confirm recovery password. */
  confirmRecoveryPassword(request: ResetPasswordRequest): Observable<boolean> {
    return this.post<ResetPasswordRequest, boolean>(
      request,
      ApiUrls.accounts.resetPassword,
      (response) => response.isSuccess,
    );
  }

  /** Resend email code. */
  confirmEmailResent(request: ResendEmailConfirmation): Observable<boolean> {
    return this.post<ResendEmailConfirmation, boolean>(
      request,
      ApiUrls.accounts.resendEmailConfirmation,
      (response) => response.isSuccess,
    );
  }

  /** Verify email. */
  verifyEmail(request: VerifyEmailRequest): Observable<boolean> {
    return this.post<VerifyEmailRequest, boolean>(
      request,
      ApiUrls.accounts.verifyEmail,
      (response) => response.isSuccess,
    );
  }
}
