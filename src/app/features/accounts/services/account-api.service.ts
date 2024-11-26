import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../core/config/api-urls';
import { ApiService } from '../../../core/services/api.service';
import { RecoveryConfirmPasswordRequest } from '../models/recovery-confirm-password-request';
import { RecoveryPasswordRequest } from '../models/recovery-password-request';

@Injectable({ providedIn: 'root' })
export class AccountApiService extends ApiService {
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
}
