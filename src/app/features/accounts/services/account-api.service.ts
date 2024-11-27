import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../core/config/api-urls';
import { ApiBaseService } from '../../../core/services/api.base.service';
import { ConfirmEmailResentRequest } from '../models/confirm-email-resent.request';
import { ConfirmEmailVerifyRequest } from '../models/confirm-email-verify.request';
import { RecoveryConfirmPasswordRequest } from '../models/recovery-confirm-password.request';
import { RecoveryPasswordRequest } from '../models/recovery-password.request';

@Injectable({ providedIn: 'root' })
export class AccountApiService extends ApiBaseService {
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
