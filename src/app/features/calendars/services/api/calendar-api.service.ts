import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { EmptyRequest } from '../../../../core/http/types/empty-request.type';
import { NoContent } from '../../../../core/http/types/no-content.type';
import { ApiBaseService } from '../../../../core/services/api/api.base.service';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { PaginatedResult } from '../../../../shared/paginated-result/paginated-result';
import { CalendarCreateRequest } from '../../interfaces/requests/calendar-create.request';
import { CalendarUpdateRequest } from '../../interfaces/requests/calendar-update-request';
import { CalendarUpdateSettingsRequest } from '../../interfaces/requests/calendar-update-settings.request';
import { CalendarCreateResponse } from '../../interfaces/responses/calendar-create.response';
import { CalendarDetailsResponse } from '../../interfaces/responses/calendar-details.response';
import { CalendarPaginatedResponse } from '../../interfaces/responses/calendar-paginated.response';
import { CalendarSettingsResponse } from '../../interfaces/responses/calendar-settings.response';

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
  createCalendar(request: CalendarCreateRequest): Observable<CalendarCreateResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.createCalendar);

    return this.post<CalendarCreateRequest, CalendarCreateResponse>(
      request,
      endpoint,
      (response) => response.value as CalendarCreateResponse,
    );
  }

  /** Actualizar un calendario. */
  updateCalendar(calendarId: string, request: CalendarUpdateRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.updateCalendar, { calendarId: calendarId });

    return this.put<CalendarUpdateRequest, NoContent>(request, endpoint);
  }

  /** Actualizar configuración de calendario */
  updateCalendarSettings(calendarId: string, request: CalendarUpdateSettingsRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.updateCalendarSettings, { calendarId: calendarId });

    return this.put<CalendarUpdateSettingsRequest, NoContent>(request, endpoint);
  }

  /** Toggle active calendar. */
  toggleIsActive(calendarId: string): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.toggleIsActive, { calendarId: calendarId });

    return this.put<EmptyRequest, NoContent>({}, endpoint);
  }
}
