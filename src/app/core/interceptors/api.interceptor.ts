import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { LocalizationService } from '../localizations/localization.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly localizationService = inject(LocalizationService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token && !request.headers.has('Authorization')) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
    }

    if (!request.headers.has('Accept-Language')) {
      request = request.clone({
        headers: request.headers.set('Accept-Language', this.localizationService.getLocaleValue()),
      });
    }

    if (!request.headers.has('Content-Language')) {
      request = request.clone({
        headers: request.headers.set('Content-Language', this.localizationService.getLocaleValue()),
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    }

    return next.handle(request);
  }
}
