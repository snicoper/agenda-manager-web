import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { EmptyRequest } from '../../../../core/http/types/empty-request.type';
import { NoContent } from '../../../../core/http/types/no-content.type';
import { ApiBaseService } from '../../../../core/services/api/api.base.service';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { AccountCreateRequest } from '../../interfaces/requests/account-create.request';
import { AccountUpdateRequest } from '../../interfaces/requests/account-update.request';
import { ConfirmAccountRequest } from '../../interfaces/requests/confirm-account.request';
import { RequestPasswordResetRequest } from '../../interfaces/requests/request-password-reset.request';
import { ResendEmailConfirmation } from '../../interfaces/requests/resend-email-confirmation.request';
import { ResetPasswordRequest } from '../../interfaces/requests/reset-password.request';
import { VerifyEmailRequest } from '../../interfaces/requests/verify-email.request';
import { AccountCreateResponse } from '../../interfaces/responses/account-create.response';
import { AccountDetailsResponse } from '../../interfaces/responses/account-details.response';
import { AccountPaginatedResponse } from '../../interfaces/responses/account-paginated.response';
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';

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

  /** Recovery password. */
  requestPasswordReset(request: RequestPasswordResetRequest): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.requestPasswordReset);

    return this.post<RequestPasswordResetRequest, boolean>(request, endpoint, (response) => response.isSuccess);
  }

  /** Resend email code. */
  resendEmailConfirmation(request: ResendEmailConfirmation): Observable<boolean> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.resendEmailConfirmation);

    return this.post<ResendEmailConfirmation, boolean>(request, endpoint, (response) => response.isSuccess);
  }

  /** Account confirmation. */
  confirmAccount(request: ConfirmAccountRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.confirmAccount);

    return this.put<ConfirmAccountRequest, NoContent>(request, endpoint, (response) => response.value as NoContent);
  }

  /** Confirm recovery password. */
  resetPassword(request: ResetPasswordRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.resetPassword);

    return this.put<ResetPasswordRequest, NoContent>(request, endpoint, (response) => response.value as NoContent);
  }

  /** Verify email. */
  verifyEmail(request: VerifyEmailRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.verifyEmail);

    return this.put<VerifyEmailRequest, NoContent>(request, endpoint, (response) => response.value as NoContent);
  }

  /** Update account. */
  updateAccount(userId: string, request: AccountUpdateRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.updateAccount, { userId: userId });

    return this.put<AccountUpdateRequest, NoContent>(request, endpoint, (response) => response.value as NoContent);
  }

  /** Toggle account is active. */
  toggleIsActive(userId: string): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.toggleIsActive, { userId: userId });

    return this.put<EmptyRequest, NoContent>({}, endpoint, (response) => response.value as NoContent);
  }

  /** Confirm email. */
  confirmEmail(userId: string): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.confirmEmail, { userId: userId });

    return this.put<EmptyRequest, NoContent>({}, endpoint, (response) => response.value as NoContent);
  }
}
