import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { logDebug } from '../../errors/log-messages';
import { BrowserStorageService } from '../../services/browser-storage.service';
import { BrowserStorageKey } from '../../types/browser-storage-key.enum';
import { AuthState } from '../models/auth-state';
import { LoginRequest } from '../models/login.request';
import { LoginResponse } from '../models/login.response';
import { RefreshTokenRequest } from '../models/refresh-token.request';
import { AuthApiService } from './auth-api.service';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private readonly browserStorageService = inject(BrowserStorageService);
  private readonly authApiService = inject(AuthApiService);

  private state = signal<AuthState>({
    isLoading: false,
    isLoggedIn: false,
  });

  isLoggedIn = computed(() => this.state().isLoggedIn);
  isLoading = computed(() => this.state().isLoading);

  private tokenDecode: Record<string, unknown> = {};
  private accessToken = '';
  private refreshToken = '';
  private checkTokenInterval?: ReturnType<typeof setInterval>;

  ngOnDestroy(): void {
    if (this.checkTokenInterval) {
      clearInterval(this.checkTokenInterval);
    }
  }

  initialize(): void {
    this.restoreAuthState();
    this.initTokenCheck();
  }

  login(loginRequest: LoginRequest): Observable<boolean> {
    this.updateAuthState({ isLoading: true, isLoggedIn: false });

    return this.authApiService.login(loginRequest).pipe(
      map((response) => {
        this.updateAuthState({ isLoading: false, isLoggedIn: true });
        this.setTokenFromLoginResponse(response);

        return true;
      }),
    );
  }

  tryRefreshToken(): Observable<string> {
    if (!this.refreshToken) {
      logDebug('No refresh token available');

      return of('No refresh token available');
    }

    this.updateAuthState({ isLoading: true, isLoggedIn: false });
    const refreshTokenRequest: RefreshTokenRequest = {
      refreshToken: this.refreshToken,
    };

    return this.authApiService.refreshToken(refreshTokenRequest).pipe(
      map((response) => {
        this.updateAuthState({ isLoading: false, isLoggedIn: true });
        this.setTokenFromLoginResponse(response);

        return this.getToken();
      }),
      catchError((error) => {
        this.updateAuthState({ isLoading: false, isLoggedIn: false });

        return throwError(() => error);
      }),
    );
  }

  logout(): void {
    this.updateAuthState({ isLoading: true, isLoggedIn: false });
    this.browserStorageService.remove(BrowserStorageKey.AccessToken);
    this.browserStorageService.remove(BrowserStorageKey.RefreshToken);
    this.tokenDecode = {};
  }

  getToken(): string {
    return this.accessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  getEmail(): string {
    return this.getValueFromToken('email', '');
  }

  getName(): string {
    return this.getValueFromToken('family_name', '');
  }

  getIdentifier(): string {
    return this.getValueFromToken('id', '');
  }

  getRoles(): string[] {
    return this.getValueFromToken('http://schemas.microsoft.com/ws/2008/06/identity/claims/role', []);
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  getPermissions(): string[] {
    return this.getValueFromToken('permissions', []);
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  isExpired(): boolean {
    const expiry = this.getValueFromToken('exp', 0);

    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  private updateAuthState(newState: AuthState): void {
    this.state.update((currentState) => ({
      ...currentState,
      ...newState,
    }));
  }

  private setTokenFromLoginResponse(response: LoginResponse): void {
    this.browserStorageService.set(BrowserStorageKey.AccessToken, response.accessToken);
    this.browserStorageService.set(BrowserStorageKey.RefreshToken, response.refreshToken);

    this.tokenDecode = jwtDecode(response.accessToken);
    this.accessToken = response.accessToken;
    this.refreshToken = response.refreshToken;
  }

  private restoreAuthState(): void {
    const storedToken = this.browserStorageService.get(BrowserStorageKey.AccessToken);

    if (!storedToken) {
      return;
    }

    try {
      this.tokenDecode = jwtDecode(storedToken);
      this.accessToken = storedToken;
      this.refreshToken = this.browserStorageService.get(BrowserStorageKey.RefreshToken) ?? '';

      if (!this.isExpired()) {
        this.updateAuthState({ isLoading: this.state().isLoading, isLoggedIn: true });
      } else {
        this.logout();
      }
    } catch {
      this.logout();
    }
  }

  private initTokenCheck(): void {
    this.checkTokenInterval = setInterval(() => {
      if (!this.isValidToken()) {
        this.handleExpiredToken();
      }
    }, 60000);
  }

  private handleExpiredToken(): void {
    this.tryRefreshToken().subscribe();
  }

  private isValidToken(): boolean {
    return !!this.accessToken && !this.isExpired();
  }

  private getValueFromToken<T>(key: string, defaultValue: T): T {
    if (!this.accessToken || !(key in this.tokenDecode)) {
      return defaultValue;
    }

    return this.tokenDecode[key] as T;
  }
}
