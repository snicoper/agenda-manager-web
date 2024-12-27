import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../modules/auth/services/auth.service';
import { LocaleStateService } from '../modules/i18n/services/locale.state.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly localeStateService = inject(LocaleStateService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let headers = request.headers;
    const token = this.authService.getToken();
    const locale = this.localeStateService.value();

    if (token && !headers.has('Authorization')) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    headers = headers
      .set('Accept-Language', locale!)
      .set('Content-Language', locale!)
      .set('Content-Type', 'application/json');

    request = request.clone({ headers });

    return next.handle(request);
  }
}
