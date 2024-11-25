import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { ApiService } from '../../../../core/services/api.service';
import { RecoveryPasswordRequest } from '../models/recovery-password-request';

@Injectable({ providedIn: 'root' })
export class AccountApiService extends ApiService {
  recoveryPassword(request: RecoveryPasswordRequest): Observable<boolean> {
    return this.post<RecoveryPasswordRequest, boolean>(
      request,
      ApiUrls.accounts.recoveryPassword,
      (response) => response.isSuccess,
    );
  }
}
