import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { map, Observable } from 'rxjs';
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
    this.state.update((state) => ({
      ...state,
      isLoading: true,
      isLoggedIn: false,
    }));

    return this.authApiService.login(loginRequest).pipe(
      map((response) => {
        this.state.update((state) => ({
          ...state,
          isLoading: false,
          isLoggedIn: true,
        }));

        this.setTokenFromLoginResponse(response);

        return true;
      }),
    );
  }

  tryRefreshToken(): void {
    if (!this.refreshToken) {
      return;
    }

    this.state.update((state) => ({
      ...state,
      isLoading: true,
      isLoggedIn: false,
    }));

    logDebug('Refreshing token...');

    const refreshTokenRequest: RefreshTokenRequest = {
      refreshToken: this.refreshToken,
    };

    this.authApiService.refreshToken(refreshTokenRequest).subscribe({
      next: (response) => {
        this.state.update((state) => ({
          ...state,
          isLoading: false,
          isLoggedIn: true,
        }));

        this.setTokenFromLoginResponse(response);
        logDebug('Token refreshed');
      },
      error: () => {
        logDebug('Token refresh failed');
        this.logout();
      },
    });
  }

  logout(): void {
    this.state.update((state) => ({
      ...state,
      isLoading: false,
      isLoggedIn: false,
    }));

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

  private setTokenFromLoginResponse(response: LoginResponse): void {
    this.browserStorageService.set(BrowserStorageKey.AccessToken, response.accessToken);
    this.browserStorageService.set(BrowserStorageKey.RefreshToken, response.refreshToken);

    this.tokenDecode = jwtDecode(response.accessToken);
    this.accessToken = response.accessToken;
    this.refreshToken = response.refreshToken;
  }

  private restoreAuthState(): void {
    const storedToken = this.browserStorageService.get(BrowserStorageKey.AccessToken);

    if (storedToken) {
      try {
        this.tokenDecode = jwtDecode(storedToken);
        this.accessToken = storedToken;
        this.refreshToken = this.browserStorageService.get(BrowserStorageKey.RefreshToken) ?? '';

        if (!this.isExpired()) {
          this.state.update((state) => ({
            ...state,
            isLoggedIn: true,
          }));
        } else {
          this.logout();
        }
      } catch {
        this.logout();
      }
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
    this.tryRefreshToken();
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
