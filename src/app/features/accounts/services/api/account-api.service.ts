import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { EmptyRequest } from '../../../../core/http/types/empty-request.type';
import { NoContent } from '../../../../core/http/types/no-content.type';
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';
import { ApiBaseService } from '../../../../core/services/api/api.base.service';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { AccountCreateRequest } from '../../models/requests/account-create.request';
import { AccountUpdateRequest } from '../../models/requests/account-update.request';
import { ConfirmAccountRequest } from '../../models/requests/confirm-account.request';
import { RequestPasswordResetRequest } from '../../models/requests/request-password-reset.request';
import { ResendEmailConfirmation } from '../../models/requests/resend-email-confirmation.request';
import { ResetPasswordRequest } from '../../models/requests/reset-password.request';
import { VerifyEmailRequest } from '../../models/requests/verify-email.request';
import { AccountCreateResponse } from '../../models/responses/account-create.response';
import { AccountDetailsResponse } from '../../models/responses/account-details.response';
import { AccountPaginatedResponse } from '../../models/responses/account-paginated.response';

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
        dateJoined: DateTimeUtils.fromApi(account.dateJoined) as DateTime,
      }));

      return result;
    });
  }

  /** Get account details. */
  getAccountById(userId: string): Observable<AccountDetailsResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.getAccountById, { userId: userId });

    return this.get<AccountDetailsResponse>(endpoint, (response) => {
      return {
        ...response.value,
        createAt: DateTimeUtils.fromApi(response.value.createdAt) as DateTime,
      };
    });
  }

  /** Create account. */
  createAccount(request: AccountCreateRequest): Observable<AccountCreateResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.createAccount);

    return this.post<AccountCreateRequest, AccountCreateResponse>(
      request,
      endpoint,
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
