import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../config/api-urls';
import { ApiService } from '../../http/api.service';
import { LoginRequest } from '../models/login.request';
import { LoginResponse } from '../models/login.response';

@Injectable({ providedIn: 'root' })
export class AuthApiService extends ApiService {
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.post<LoginRequest, LoginResponse>(loginRequest, ApiUrls.authentication.login, (response) => ({
      // Mapping from ApiResponse to LoginResponse
      ...response.value,
    }));
  }

  refreshToken(refreshToken: string): Observable<LoginResponse> {
    return this.post<unknown, LoginResponse>(refreshToken, ApiUrls.authentication.refreshToken, (response) => ({
      // Mapping from ApiResponse to LoginResponse
      ...response.value,
    }));
  }
}
