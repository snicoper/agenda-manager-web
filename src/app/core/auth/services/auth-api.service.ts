import { Injectable } from '@angular/core';
import { ApiUrls } from '../../config/api-urls';
import { ApiService } from '../../http/api.service';
import { LoginRequest } from '../models/login.request';
import { LoginResponse } from '../models/login.response';

@Injectable({ providedIn: 'root' })
export class AuthApiService extends ApiService {
  login(loginRequest: LoginRequest) {
    return this.post<LoginRequest, LoginResponse>(loginRequest, ApiUrls.authentication.login, (response) => ({
      // Mapping from ApiResponse to LoginResponse
      ...response.value,
    }));
  }
}
