import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DateTimeUtils } from '../../../../../shared/utils/date/datetime.utils';
import { UrlUtils } from '../../../../../shared/utils/url/url.utils';
import { ApiUrls } from '../../../../config/api-urls';
import { ApiBaseService } from '../../../../services/api/api.base.service';
import { LoginRequest } from '../../interfaces/requests/login.request';
import { RefreshTokenRequest } from '../../interfaces/requests/refresh-token.request';
import { LoginResponse } from '../../interfaces/responses/login.response';

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
