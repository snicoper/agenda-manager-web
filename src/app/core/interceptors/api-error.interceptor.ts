import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { SiteUrls } from '../config/site-urls';
import { logError, logWarning } from '../errors/logger/logger';
import { AuthService } from '../modules/auth/services/auth.service';
import { SnackBarService } from '../services/snackbar.service';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly snackBarService = inject(SnackBarService);

  private isRefreshing = false;
  private refreshTokenSubject$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  /** Handle error de la aplicación. */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            return this.handleUnauthorized(request, next, error);
          case HttpStatusCode.NotFound:
            this.handleNotFound(error);
            break;
          case HttpStatusCode.Forbidden:
            this.handleForbidden(error);
            break;
          case HttpStatusCode.BadRequest:
          case HttpStatusCode.Conflict:
            this.handleBadRequest(error);
            break;
          case HttpStatusCode.NoContent:
            break;
          default:
            this.handleUnknownError(error);
        }

        return throwError(() => error);
      }),
    );
  }

  /** Manejar error Unauthorized. */
  private handleUnauthorized(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    error: HttpErrorResponse,
  ): Observable<HttpEvent<unknown>> {
    logWarning('ApiErrorInterceptor.handleUnauthorized', error);

    if (!this.authService.getToken() && !this.authService.getRefreshToken()) {
      this.authService.logout();
      this.router.navigate([SiteUrls.auth.login]);

      return throwError(() => new Error('No tokens available'));
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject$.next(null);

      return this.authService.tryRefreshToken().pipe(
        switchMap((newToken) => {
          this.isRefreshing = false;
          this.refreshTokenSubject$.next(newToken);

          return next.handle(this.addTokenToRequest(request, newToken));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          this.router.navigate([SiteUrls.auth.login]);

          return throwError(() => error);
        }),
      );
    }

    // Si ya hay un refresh en proceso, esperar y reintentar con el nuevo token.
    return this.refreshTokenSubject$.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenToRequest(request, token!))),
    );
  }

  private addTokenToRequest(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  /** Manejar error NotFound. */
  private handleNotFound(error: HttpErrorResponse): void {
    logWarning('ApiErrorInterceptor.handleNotFound', error);
  }

  /** Manejar error Forbidden.  */
  private handleForbidden(error: HttpErrorResponse): void {
    logWarning('ApiErrorInterceptor.handleForbidden', error);
  }

  /** Manejar error BadRequest. */
  private handleBadRequest(error: HttpErrorResponse): void {
    logWarning('ApiErrorInterceptor.handleBadRequest', error);
  }

  /** Errores 500. */
  private handleUnknownError(error: HttpErrorResponse): void {
    logError('ApiErrorInterceptor.handleUnknownError', error);

    this.snackBarService.error(
      `Ha ocurrido un error, por favor si el problema persiste póngase en contacto con la administración.`,
    );
  }
}
