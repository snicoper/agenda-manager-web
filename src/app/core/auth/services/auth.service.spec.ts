import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DateTimeUtils } from '../../../shared/utils/date/datetime.utils';
import { BrowserStorageKey } from '../../enums/browser-storage-key.enum';
import { BrowserStorageService } from '../../services/browser-storage.service';
import { AuthApiService } from './api/auth-api.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let browserStorageService: jasmine.SpyObj<BrowserStorageService>;
  let authApiService: jasmine.SpyObj<AuthApiService>;
  let router: jasmine.SpyObj<Router>;

  const mockLoginResponse = {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJmYW1pbHlfbmFtZSI6IlRlc3QgVXNlciIsImlkIjoiMTIzIiwicm9sZXMiOlsiVXNlciJdLCJwZXJtaXNzaW9ucyI6WyJyZWFkOnVzZXJzIl0sImV4cCI6OTk5OTk5OTk5OX0',
    refreshToken: 'refresh-token',
    expires: DateTimeUtils.fromApi('2024-12-22T10:00:00Z'),
  };

  beforeEach(() => {
    const browserStorageSpy = jasmine.createSpyObj('BrowserStorageService', ['get', 'set', 'remove']);
    const authApiSpy = jasmine.createSpyObj('AuthApiService', ['login', 'refreshToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: BrowserStorageService, useValue: browserStorageSpy },
        { provide: AuthApiService, useValue: authApiSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authService = TestBed.inject(AuthService);
    browserStorageService = TestBed.inject(BrowserStorageService) as jasmine.SpyObj<BrowserStorageService>;
    authApiService = TestBed.inject(AuthApiService) as jasmine.SpyObj<AuthApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('login', () => {
    const loginRequest = { email: 'test@test.com', password: 'password' };

    it('should successfully login and store tokens', (done) => {
      authApiService.login.and.returnValue(of(mockLoginResponse));

      authService.login(loginRequest).subscribe({
        next: (result) => {
          expect(result).toBeTrue();
          expect(browserStorageService.set).toHaveBeenCalledWith(
            BrowserStorageKey.AccessToken,
            mockLoginResponse.accessToken,
          );
          expect(browserStorageService.set).toHaveBeenCalledWith(
            BrowserStorageKey.RefreshToken,
            mockLoginResponse.refreshToken,
          );
          expect(authService.authState.isLoggedIn()).toBeTrue();
          expect(authService.authState.isLoading()).toBeFalse();
          done();
        },
      });
    });
  });

  describe('tryRefreshToken', () => {
    it('should return error when no refresh token available', (done) => {
      authService.tryRefreshToken().subscribe({
        next: (result) => {
          expect(result).toBe('No refresh token available');
          expect(authApiService.refreshToken).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('logout', () => {
    it('should clear tokens and auth state and redirect to login', () => {
      authService.logout();

      expect(browserStorageService.remove).toHaveBeenCalledWith(BrowserStorageKey.AccessToken);
      expect(browserStorageService.remove).toHaveBeenCalledWith(BrowserStorageKey.RefreshToken);
      expect(authService.authState.isLoggedIn()).toBeFalse();
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('token validation', () => {
    it('should handle token expiration date correctly', () => {
      browserStorageService.get.and.returnValue(mockLoginResponse.accessToken);
      authService.initialize();

      const isExpired = authService.isExpired();
      expect(isExpired).toBeFalse();
    });

    it('should correctly check permissions', () => {
      browserStorageService.get.and.returnValue(mockLoginResponse.accessToken);
      authService.initialize();

      expect(authService.hasPermission('read:users')).toBeTrue();
      expect(authService.hasPermission('write:users')).toBeFalse();
    });
  });

  describe('initialize', () => {
    it('should restore auth state from storage', () => {
      browserStorageService.get.and.returnValue(mockLoginResponse.accessToken);

      authService.initialize();

      expect(authService.authState.isLoggedIn()).toBeTrue();
      expect(browserStorageService.get).toHaveBeenCalled();
    });

    it('should handle invalid stored token', () => {
      browserStorageService.get.and.returnValue('invalid-token');

      authService.initialize();

      expect(authService.authState.isLoggedIn()).toBeFalse();
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
