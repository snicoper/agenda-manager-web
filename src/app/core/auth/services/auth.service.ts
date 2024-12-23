import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { SiteUrls } from '../../config/site-urls';
import { BrowserStorageKey } from '../../enums/browser-storage-key.enum';
import { logError } from '../../errors/debug-logger';
import { BrowserStorageService } from '../../services/browser-storage.service';
import { AuthState } from '../interfaces/auth-state.interface';
import { LoginRequest } from '../interfaces/requests/login.request';
import { RefreshTokenRequest } from '../interfaces/requests/refresh-token.request';
import { LoginResponse } from '../interfaces/responses/login.response';
import { AuthApiService } from './api/auth-api.service';

/**
 * Servicio de autenticación para gestionar el estado de autenticación del usuario.
 * Proporciona métodos para iniciar sesión, renovar tokens, cerrar sesión, y obtener información del usuario.
 */
@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  // Servicios inyectados necesarios.
  private readonly browserStorageService = inject(BrowserStorageService);
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);

  // Señales para gestionar el estado de autenticación.
  private readonly isLoading$ = signal<boolean>(false);
  private readonly isLoggedIn$ = signal<boolean>(false);

  // Estado de autenticación observable.
  readonly authState: AuthState = {
    isLoading: computed(() => this.isLoading$()),
    isLoggedIn: computed(() => this.isLoggedIn$()),
  };

  // Variables internas para gestionar los tokens.
  private tokenDecode: Record<string, unknown> = {};
  private accessToken = '';
  private refreshToken = '';
  private checkTokenInterval?: ReturnType<typeof setInterval>;

  /**
   * Limpia el intervalo de comprobación del token cuando el servicio se destruye.
   */
  ngOnDestroy(): void {
    if (this.checkTokenInterval) {
      clearInterval(this.checkTokenInterval);
    }
  }

  /**
   * Inicializa el estado de autenticación restaurando el estado y configurando la comprobación del token.
   */
  initialize(): void {
    this.restoreAuthState();
    this.initTokenCheck();
  }

  /**
   * Inicia sesión del usuario haciendo una solicitud a la API y actualiza el estado de autenticación.
   *
   * @param loginRequest Credenciales de inicio de sesión.
   * @returns Observable que indica si el inicio de sesión fue exitoso.
   */
  login(loginRequest: LoginRequest): Observable<boolean> {
    this.updateAuthState(true, false);

    return this.authApiService.login(loginRequest).pipe(
      map((response) => {
        this.updateAuthState(false, true);
        this.setTokenFromLoginResponse(response);

        return true;
      }),
    );
  }

  /**
   * Intenta renovar el token de acceso usando el token de actualización.
   *
   * @returns Observable que contiene el nuevo token de acceso o un mensaje de error.
   */
  tryRefreshToken(): Observable<string> {
    if (!this.refreshToken) {
      logError('No refresh token available');

      return of('No refresh token available');
    }

    this.updateAuthState(true, false);
    const refreshTokenRequest: RefreshTokenRequest = {
      refreshToken: this.refreshToken,
    };

    return this.authApiService.refreshToken(refreshTokenRequest).pipe(
      map((response) => {
        this.updateAuthState(false, true);
        this.setTokenFromLoginResponse(response);

        return this.getToken();
      }),
      catchError((error) => {
        this.updateAuthState(false, false);

        return throwError(() => error);
      }),
    );
  }

  /**
   * Cierra la sesión del usuario eliminando los tokens y redirigiendo a la página de inicio de sesión.
   */
  logout(): void {
    this.updateAuthState(true, false);
    this.browserStorageService.remove(BrowserStorageKey.AccessToken);
    this.browserStorageService.remove(BrowserStorageKey.RefreshToken);
    this.tokenDecode = {};

    this.router.navigate([SiteUrls.auth.login]);
  }

  /**
   * Obtiene el token de acceso actual.
   *
   * @returns Token de acceso.
   */
  getToken(): string {
    return this.accessToken;
  }

  /**
   * Obtiene el token de actualización actual.
   *
   * @returns Token de actualización.
   */
  getRefreshToken(): string {
    return this.refreshToken;
  }

  /**
   * Obtiene el email del usuario decodificado del token de acceso.
   *
   * @returns Email del usuario.
   */
  getEmail(): string {
    return this.getValueFromToken('email', '');
  }

  /**
   * Obtiene el nombre del usuario decodificado del token de acceso.
   *
   * @returns Nombre del usuario.
   */
  getName(): string {
    return this.getValueFromToken('family_name', '');
  }

  /**
   * Obtiene el identificador del usuario decodificado del token de acceso.
   *
   * @returns Identificador del usuario.
   */
  getIdentifier(): string {
    return this.getValueFromToken('id', '');
  }

  /**
   * Obtiene los roles del usuario decodificados del token de acceso.
   *
   * @returns Array con los roles del usuario.
   */
  getRoles(): string[] {
    return this.getValueFromToken('http://schemas.microsoft.com/ws/2008/06/identity/claims/role', []);
  }

  /**
   * Verifica si el usuario tiene un rol específico.
   *
   * @param role Rol a verificar.
   * @returns `true` si el usuario tiene el rol, `false` en caso contrario.
   */
  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  /**
   * Obtiene los permisos del usuario decodificados del token de acceso.
   *
   * @returns Array con los permisos del usuario.
   */
  getPermissions(): string[] {
    return this.getValueFromToken('permissions', []);
  }

  /**
   * Verifica si el usuario tiene un permiso específico.
   *
   * @param permission Permiso a verificar.
   * @returns `true` si el usuario tiene el permiso, `false` en caso contrario.
   */
  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  /**
   * Verifica si el token de acceso ha expirado.
   *
   * @returns `true` si el token ha expirado, `false` en caso contrario.
   */
  isExpired(): boolean {
    const expiry = this.getValueFromToken('exp', 0);

    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  /**
   * Actualiza el estado de autenticación.
   *
   * @param isLoading Indica si la autenticación está en proceso de carga.
   * @param isLoggedIn Indica si el usuario está autenticado.
   */
  private updateAuthState(isLoading: boolean, isLoggedIn: boolean): void {
    this.isLoading$.update(() => isLoading);
    this.isLoggedIn$.update(() => isLoggedIn);
  }

  /**
   * Establece los tokens de acceso y actualización desde la respuesta de inicio de sesión.
   *
   * @param response Respuesta de inicio de sesión que contiene los tokens.
   */
  private setTokenFromLoginResponse(response: LoginResponse): void {
    try {
      this.tokenDecode = jwtDecode(response.accessToken);
      this.accessToken = response.accessToken;
      this.refreshToken = response.refreshToken;

      this.browserStorageService.set(BrowserStorageKey.AccessToken, response.accessToken);
      this.browserStorageService.set(BrowserStorageKey.RefreshToken, response.refreshToken);
    } catch (error) {
      logError('Invalid token specified: ', error);
      this.logout();
    }
  }

  /**
   * Restaura el estado de autenticación desde el almacenamiento del navegador.
   */
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
        this.updateAuthState(this.isLoading$(), true);
      } else {
        this.logout();
      }
    } catch (error) {
      logError('Invalid token specified: ', error);
      this.logout();
    }
  }

  /**
   * Inicializa la comprobación periódica del token para gestionar su validez.
   */
  private initTokenCheck(): void {
    this.checkTokenInterval = setInterval(() => {
      if (!this.isValidToken()) {
        this.handleExpiredToken();
      }
    }, 60000);
  }

  /**
   * Maneja el caso en que el token de acceso ha expirado intentando renovarlo.
   */
  private handleExpiredToken(): void {
    this.tryRefreshToken().subscribe();
  }

  /**
   * Verifica si el token de acceso es válido.
   *
   * @returns `true` si el token es válido, `false` en caso contrario.
   */
  private isValidToken(): boolean {
    return !!this.accessToken && !this.isExpired();
  }

  /**
   * Obtiene un valor del token de acceso decodificado.
   *
   * @param key Clave del valor a obtener.
   * @param defaultValue Valor por defecto si la clave no se encuentra.
   * @returns El valor del token o el valor por defecto.
   */
  private getValueFromToken<T>(key: string, defaultValue: T): T {
    if (!this.accessToken || !(key in this.tokenDecode)) {
      return defaultValue;
    }

    return this.tokenDecode[key] as T;
  }
}
