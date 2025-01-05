import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../../../core/config/api-urls';
import { ApiBaseService } from '../../../../../../core/services/api/api.base.service';
import { UrlUtils } from '../../../../../../core/utils/url/url.utils';
import { CalendarSelector } from '../../models/requests/calendar-selector.request';

@Injectable({ providedIn: 'root' })
export class CalendarSelectorApiService extends ApiBaseService {
  /** Get list of calendars. */
  getCalendars(): Observable<CalendarSelector[]> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.getCalendars);

    return this.get<CalendarSelector[]>(endpoint, (response) => response.value as CalendarSelector[]);
  }
}
