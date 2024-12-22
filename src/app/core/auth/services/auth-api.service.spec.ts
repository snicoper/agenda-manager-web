import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiUrls } from '../../config/api-urls';
import { DateTimeUtils } from '../../utils/datetime.utils';
import { UrlUtils } from '../../utils/url.utils';
import { LoginRequest } from '../models/login.request';
import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthApiService],
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login', () => {
    it('should make POST request and transform response', () => {
      // Arrange
      const loginRequest: LoginRequest = {
        email: 'test@test.com',
        password: 'Password4!',
      };

      const mockApiResponse = {
        value: {
          accessToken: 'token123',
          refreshToken: 'refresh123',
          expires: '2024-12-22T10:00:00Z',
        },
      };

      // Act
      service.login(loginRequest).subscribe((response) => {
        // Assert
        expect(response.accessToken).toBe('token123');
        expect(response.refreshToken).toBe('refresh123');
        expect(response.expires).toEqual(DateTimeUtils.fromApi('2024-12-22T10:00:00Z'));
      });

      // Expect HTTP POST
      const req = httpMock.expectOne(UrlUtils.buildApiUrl(ApiUrls.auth.login));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);

      // Resolve request
      req.flush(mockApiResponse);
    });
  });
});
