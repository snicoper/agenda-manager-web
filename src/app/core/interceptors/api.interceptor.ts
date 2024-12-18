import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { LocaleState } from '../i18n/states/locale.state';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly localeState = inject(LocaleState);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let headers = request.headers;
    const token = this.authService.getToken();
    const locale = this.localeState.value();

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
