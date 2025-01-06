import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarSelectorIdStateService } from '../../shared/components/selectors/calendar-selector/services/state/calendar-selector-id-state.service';
import { LocaleStateService } from '../i18n/services/locale.state.service';
import { AuthService } from '../modules/auth/services/auth.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly localeStateService = inject(LocaleStateService);
  private readonly calendarSelectorIdState = inject(CalendarSelectorIdStateService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let headers = request.headers;
    const token = this.authService.getToken();
    const locale = this.localeStateService.value();

    if (token && !headers.has('Authorization')) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (this.calendarSelectorIdState.state()) {
      headers = headers.set('X-Calendar-Id', this.calendarSelectorIdState.state()!);
    }

    headers = headers
      .set('Accept-Language', locale!)
      .set('Content-Language', locale!)
      .set('Content-Type', 'application/json');

    request = request.clone({ headers });

    return next.handle(request);
  }
}
