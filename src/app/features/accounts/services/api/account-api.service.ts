import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { ApiBaseService } from '../../../../core/services/api/api.base.service';
import { PaginatedResult } from '../../../../shared/paginated-result/paginated-result';
import { EmptyRequest } from '../../../../shared/paginated-result/types/empty-request.type';
import { DateTimeUtils } from '../../../../shared/utils/date/datetime.utils';
import { UrlUtils } from '../../../../shared/utils/url/url.utils';
import { AccountCreateRequest } from '../../models/account-create.request';
import { AccountCreateResponse } from '../../models/account-create.response';
import { AccountDetailsResponse } from '../../models/account-details.response';
import { AccountPaginatedResponse } from '../../models/account-paginated.response';
import { AccountUpdateRequest } from '../../models/account-update.request';
import { ConfirmAccountRequest } from '../../models/confirm-account.request';
import { RequestPasswordResetRequest } from '../../models/request-password-reset.request';
import { ResendEmailConfirmation } from '../../models/resend-email-confirmation.request';
import { ResetPasswordRequest } from '../../models/reset-password.request';
import { VerifyEmailRequest } from '../../models/verify-email.request';

@Injectable({ providedIn: 'root' })
export class AccountApiService extends ApiBaseService {
  /** Get a paginated list of accounts. */
  getAccountsPaginated(
    paginatedResult: PaginatedResult<AccountPaginatedResponse>,
  ): Observable<PaginatedResult<AccountPaginatedResponse>> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.getAccountsPaginated);

    return this.getPaginated(paginatedResult, endpoint, (response) => {
      const result = PaginatedResult.create<AccountPaginatedResponse>(response.value);

      result.items = result.items.map((account) => ({
        ...account,
        dateJoined: DateTimeUtils.fromApi(account.dateJoined),
      }));

      return result;
    });
  }

  /** Get account details. */
  getAccountDetails(userId: string): Observable<AccountDetailsResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.getAccountDetails, { userId: userId });

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
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.confirmAccount);

    return this.post<ConfirmAccountRequest, boolean>(request, endpoint, (response) => response.isSuccess);
  }

  /** Recovery password. */
  requestPasswordReset(request: RequestPasswordResetRequest): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.requestPasswordReset);

    return this.post<RequestPasswordResetRequest, boolean>(request, endpoint, (response) => response.isSuccess);
  }

  /** Confirm recovery password. */
  confirmRecoveryPassword(request: ResetPasswordRequest): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.resetPassword);

    return this.post<ResetPasswordRequest, boolean>(request, endpoint, (response) => response.isSuccess);
  }

  /** Resend email code. */
  confirmEmailResent(request: ResendEmailConfirmation): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.resendEmailConfirmation);

    return this.post<ResendEmailConfirmation, boolean>(request, endpoint, (response) => response.isSuccess);
  }

  /** Verify email. */
  verifyEmail(request: VerifyEmailRequest): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.verifyEmail);

    return this.post<VerifyEmailRequest, boolean>(request, endpoint, (response) => response.isSuccess);
  }

  /** Update account. */
  updateAccount(userId: string, request: AccountUpdateRequest): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.updateAccount, { userId: userId });

    return this.put<AccountUpdateRequest, boolean>(request, endpoint, (response) => response.isSuccess);
  }

  /** Toggle account is active. */
  toggleIsActive(userId: string): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.toggleIsActive, { userId: userId });

    return this.put<EmptyRequest, boolean>({}, endpoint, (response) => response.isSuccess);
  }

  /** Confirm email. */
  confirmEmail(userId: string): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.confirmEmail, { userId: userId });

    return this.put<EmptyRequest, boolean>({}, endpoint, (response) => response.isSuccess);
  }

  /** Toggle account is collaborator. */
  toggleIsCollaborator(userId: string): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.toggleIsCollaborator, { userId: userId });

    return this.put<EmptyRequest, boolean>({}, endpoint, (response) => response.isSuccess);
  }
}
