import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../core/config/api-urls';
import { PaginatedResult } from '../../../core/paginated-result/paginated-result';
import { ApiBaseService } from '../../../core/services/api/api.base.service';
import { UrlUtils } from '../../../core/utils/url.utils';
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
}
