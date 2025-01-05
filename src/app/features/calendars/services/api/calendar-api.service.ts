import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../core/config/api-urls';
import { EmptyRequest } from '../../../../core/http/types/empty-request.type';
import { NoContent } from '../../../../core/http/types/no-content.type';
import { PaginatedResult } from '../../../../core/modules/paginated-result/paginated-result';
import { ApiBaseService } from '../../../../core/services/api/api.base.service';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { CalendarAvailableDaysRequest } from '../../models/requests/calendar-available-days.request';
import { CalendarCreateRequest } from '../../models/requests/calendar-create.request';
import { CalendarHolidayCreateRequest } from '../../models/requests/calendar-hoiday-create.request';
import { CalendarHolidayUpdateRequest } from '../../models/requests/calendar-holiday-update.request';
import { CalendarUpdateRequest } from '../../models/requests/calendar-update-request';
import { CalendarUpdateSettingsRequest } from '../../models/requests/calendar-update-settings.request';
import { CalendarCreateResponse } from '../../models/responses/calendar-create.response';
import { CalendarDetailsResponse } from '../../models/responses/calendar-details.response';
import { CalendarHolidayCreateResponse } from '../../models/responses/calendar-hoiday-create.response';
import { CalendarHolidayResponse } from '../../models/responses/calendar-holiday.response';
import { CalendarPaginatedResponse } from '../../models/responses/calendar-paginated.response';
import { CalendarSettingsResponse } from '../../models/responses/calendar-settings.response';

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

  /** Get calendar holiday by id. */
  getCalendarHolidayById(calendarId: string, holidayId: string): Observable<CalendarHolidayResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.getCalendarHolidayById, {
      calendarId: calendarId,
      holidayId: holidayId,
    });

    return this.get<CalendarHolidayResponse>(endpoint, (response) => {
      const item = response.value as CalendarHolidayResponse;

      return {
        ...item,
        start: DateTimeUtils.fromApi(item.start) as DateTime,
        end: DateTimeUtils.fromApi(item.end) as DateTime,
      };
    });
  }

  /** Obtener días festivos de un calendario. */
  getCalendarHolidays(calendarId: string, year: number): Observable<CalendarHolidayResponse[]> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.getCalendarHolidaysInYear, {
      calendarId: calendarId,
      year: year.toString(),
    });

    return this.get<CalendarHolidayResponse[]>(endpoint, (response) => {
      const items = response.value as CalendarHolidayResponse[];

      return items.map((item) => ({
        ...item,
        start: DateTimeUtils.fromApi(item.start) as DateTime,
        end: DateTimeUtils.fromApi(item.end) as DateTime,
      }));
    });
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

  /** Crear dia festivo de un calendario. */
  createCalendarHoliday(
    calendarId: string,
    request: CalendarHolidayCreateRequest,
  ): Observable<CalendarHolidayCreateResponse> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.createCalendarHoliday, { calendarId: calendarId });

    return this.post<CalendarHolidayCreateRequest, CalendarHolidayCreateResponse>(
      request,
      endpoint,
      (response) => response.value as CalendarHolidayCreateResponse,
    );
  }

  /** Actualizar un calendario. */
  updateCalendar(calendarId: string, request: CalendarUpdateRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.updateCalendar, { calendarId: calendarId });

    return this.put<CalendarUpdateRequest, NoContent>(request, endpoint);
  }

  /** Actualizar días disponibles de un calendario. */
  updateAvailableDays(calendarId: string, request: CalendarAvailableDaysRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.updateAvailableDays, { calendarId: calendarId });

    return this.put<CalendarAvailableDaysRequest, NoContent>(request, endpoint);
  }

  /** Actualizar configuración de calendario. */
  updateCalendarSettings(calendarId: string, request: CalendarUpdateSettingsRequest): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.updateCalendarSettings, { calendarId: calendarId });

    return this.put<CalendarUpdateSettingsRequest, NoContent>(request, endpoint);
  }

  /** Actualizar día festivo de un calendario. */
  updateCalendarHoliday(
    calendarId: string,
    holidayId: string,
    request: CalendarHolidayUpdateRequest,
  ): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.updateCalendarHoliday, {
      calendarId: calendarId,
      holidayId: holidayId,
    });

    return this.put<CalendarHolidayUpdateRequest, NoContent>(request, endpoint);
  }

  /** Toggle active calendar. */
  toggleIsActive(calendarId: string): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.toggleIsActive, { calendarId: calendarId });

    return this.put<EmptyRequest, NoContent>({}, endpoint);
  }

  /** Delete calendar holiday. */
  deleteCalendarHoliday(calendarId: string, holidayId: string): Observable<NoContent> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.calendars.deleteCalendarHoliday, {
      calendarId: calendarId,
      holidayId: holidayId,
    });

    return this.delete<NoContent>(endpoint, (response) => response.value as NoContent);
  }
}
