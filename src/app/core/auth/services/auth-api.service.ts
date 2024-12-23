import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DateTimeUtils } from '../../../shared/utils/datetime.utils';
import { UrlUtils } from '../../../shared/utils/url.utils';
import { ApiUrls } from '../../config/api-urls';
import { ApiBaseService } from '../../services/api/api.base.service';
import { LoginRequest } from '../models/login.request';
import { LoginResponse } from '../models/login.response';
import { RefreshTokenRequest } from '../models/refresh-token.request';

@Injectable({ providedIn: 'root' })
export class AuthApiService extends ApiBaseService {
  /** Login user. */
  login(request: LoginRequest): Observable<LoginResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.auth.login);

    return this.post<LoginRequest, LoginResponse>(request, endpoint, (response) => ({
      ...response.value,
      expires: DateTimeUtils.fromApi(response.value.expires),
    }));
  }

  /** Refresh the token. */
  refreshToken(refreshToken: RefreshTokenRequest): Observable<LoginResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.auth.refreshToken);

    return this.post<RefreshTokenRequest, LoginResponse>(refreshToken, endpoint, (response) => ({
      ...response.value,
      expires: DateTimeUtils.fromApi(response.value.expires),
    }));
  }
}
