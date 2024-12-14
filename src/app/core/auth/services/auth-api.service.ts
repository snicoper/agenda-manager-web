import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../config/api-urls';
import { ApiBaseService } from '../../services/api.base.service';
import { DateTimeUtils } from '../../utils/datetime-utils';
import { LoginRequest } from '../models/login.request';
import { LoginResponse } from '../models/login.response';
import { RefreshTokenRequest } from '../models/refresh-token.request';

@Injectable({ providedIn: 'root' })
export class AuthApiService extends ApiBaseService {
  /** Login user. */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.post<LoginRequest, LoginResponse>(request, ApiUrls.auth.login, (response) => ({
      ...response.value,
      expires: DateTimeUtils.fromApi(response.value.expires),
    }));
  }

  /** Refresh the token. */
  refreshToken(refreshToken: RefreshTokenRequest): Observable<LoginResponse> {
    return this.post<RefreshTokenRequest, LoginResponse>(refreshToken, ApiUrls.auth.refreshToken, (response) => ({
      ...response.value,
      expires: DateTimeUtils.fromApi(response.value.expires),
    }));
  }
}
