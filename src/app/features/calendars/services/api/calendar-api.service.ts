import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { EmptyRequest } from '../../../../core/modules/http/types/empty-request.type';
import { NoContent } from '../../../../core/modules/http/types/no-content.type';
import { ApiBaseService } from '../../../../core/services/api/api.base.service';
import { DateTimeUtils } from '../../../../shared/utils/date/datetime.utils';
import { UrlUtils } from '../../../../shared/utils/url/url.utils';
import { CalendarCreateRequest } from '../../interfaces/requests/calendar-create.request';
import { CalendarUpdateRequest } from '../../interfaces/requests/calendar-update-request';
import { CalendarDetailsResponse } from '../../interfaces/responses/calendar-details.response';
import { CalendarPaginatedResponse } from '../../interfaces/responses/calendar-paginated.response';
import { CalendarSettingsResponse } from '../../interfaces/responses/calendar-settings.response';
import { PaginatedResult } from '../../../../shared/modules/paginated-result/paginated-result';

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
  getCalendarById(calendarId: string): Observable<CalendarDetailsResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.getCalendarById, { calendarId: calendarId });

    return this.get<CalendarDetailsResponse>(endpoint, (response) => {
      return {
        ...(response.value as CalendarDetailsResponse),
        createAt: DateTimeUtils.fromApi(response.value.createdAt),
      };
    });
  }

  /** Obtener settings de un calendario. */
  getCalendarSettings(calendarId: string): Observable<CalendarSettingsResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.getCalendarSettings, { calendarId: calendarId });

    return this.get<CalendarSettingsResponse>(endpoint, (response) => response.value as CalendarSettingsResponse);
  }

  /** Crear un calendario. */
  createCalendar(request: CalendarCreateRequest): Observable<string> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.createCalendar);

    return this.post<CalendarCreateRequest, string>(request, endpoint, (response) => response.value as string);
  }

  /** Actualizar un calendario. */
  updateCalendar(calendarId: string, request: CalendarUpdateRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.updateCalendar, { calendarId: calendarId });

    return this.put<CalendarUpdateRequest, NoContent>(request, endpoint);
  }

  /** Toggle active calendar. */
  toggleIsActive(calendarId: string): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.toggleIsActive, { calendarId: calendarId });

    return this.put<EmptyRequest, NoContent>({}, endpoint);
  }
}
