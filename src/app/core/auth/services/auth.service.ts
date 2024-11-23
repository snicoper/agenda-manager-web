import { computed, inject, Injectable, signal } from '@angular/core';
import { BrowserStorageService } from '../../services/browser-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly browserStorageService = inject(BrowserStorageService);

  private isLoggedIn$ = signal(false);

  isLoggedIn = computed(() => this.isLoggedIn$());

  login(): void {
    this.isLoggedIn$.set(true);
  }

  logout(): void {
    this.isLoggedIn$.set(false);
  }

  getToken(): string {
    return 'token';
  }

  getRefreshToken(): string {
    return 'refreshToken';
  }

  getUserId(): string {
    return 'userId';
  }

  getIdentifier(): string {
    return 'identifier';
  }

  getRoles(): string[] {
    return ['admin', 'user'];
  }

  getPermissions(): string[] {
    return ['read', 'write'];
  }

  getExpiration(): string {
    return 'expiration';
  }
}
