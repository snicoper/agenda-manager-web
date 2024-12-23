import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../core/config/api-urls';
import { ApiBaseService } from '../../../core/services/api/api.base.service';
import { PaginatedResult } from '../../../shared/paginated-result/paginated-result';
import { UrlUtils } from '../../../shared/utils/url/url.utils';
import { CalendarCreateRequest } from '../models/calendar-create.request';
import { CalendarDetailsRequest } from '../models/calendar-details.request';
import { CalendarPaginatedResponse } from '../models/calendar-paginated.response';

@Injectable({
  providedIn: 'root',
})
export class CalendarApiService extends ApiBaseService {
  /** Obtener lista paginada de calendarios. */
  getCalendarsPaginated(
    paginatedResult: PaginatedResult<CalendarPaginatedResponse>,
  ): Observable<PaginatedResult<CalendarPaginatedResponse>> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.getCalendarsPaginated);

    return this.getPaginated(
      paginatedResult,
      endpoint,
      (response) => response.value as PaginatedResult<CalendarPaginatedResponse>,
    );
  }

  /** Obtener detalles de un calendario. */
  getCalendarById(calendarId: string): Observable<CalendarDetailsRequest> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.getCalendarById, { calendarId: calendarId });

    return this.get<CalendarDetailsRequest>(endpoint, (response) => response.value as CalendarDetailsRequest);
  }

  /** Crear un calendario. */
  createCalendar(request: CalendarCreateRequest): Observable<string> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.createCalendar);

    return this.post<CalendarCreateRequest, string>(request, endpoint, (response) => response.value as string);
  }
}
