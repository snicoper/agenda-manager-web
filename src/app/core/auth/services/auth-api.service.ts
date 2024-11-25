import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../config/api-urls';
import { ApiService } from '../../services/api.service';
import { LoginRequest } from '../models/login.request';
import { LoginResponse } from '../models/login.response';
import { RefreshTokenRequest } from '../models/refresh-token.request';

@Injectable({ providedIn: 'root' })
export class AuthApiService extends ApiService {
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.post<LoginRequest, LoginResponse>(request, ApiUrls.auth.login, (response) => ({
      ...response.value,
      expires: DateTime.fromISO(response.value.expires.toString()),
    }));
  }

  refreshToken(refreshToken: RefreshTokenRequest): Observable<LoginResponse> {
    return this.post<RefreshTokenRequest, LoginResponse>(refreshToken, ApiUrls.auth.refreshToken, (response) => ({
      ...response.value,
      expires: DateTime.fromISO(response.value.expires.toString()),
    }));
  }
}
