import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DateTime } from 'luxon';
import { filter, finalize, switchMap, take } from 'rxjs';
import { logError } from '../../../../core/errors/logger/logger';
import { FormState } from '../../../../core/forms/models/form-state.model';
import { HttpErrorResponseMappingUtils } from '../../../../core/http/utils/http-error-response-mapping.utils';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { ConfirmationDialogService } from '../../../../shared/components/dialogs/confirmation-dialog/services/confirmation-dialog.service';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormDateTimeComponent } from '../../../../shared/components/forms/inputs/form-date-time/form-date-time.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { dateStartGreaterThanEndValidator } from '../../../../shared/components/forms/validators/date-start-greater-then-end.validator';
import { CalendarHolidayFieldsValidators } from '../../contracts/calendar-holiday-field-validator.contract';
import { CalendarHolidayUpdateRequest } from '../../models/requests/calendar-holiday-update.request';
import { CalendarHolidayResponse } from '../../models/responses/calendar-holiday.response';
import { CalendarApiService } from '../../services/api/calendar-api.service';
import { CalendarSelectedStateService } from '../../services/state/calendar-selected-state.service';

export interface CalendarHolidaysUpdateDataBlade {
  id: string;
  start: DateTime;
  end: DateTime;
}

@Component({
  selector: 'am-calendar-holidays-update-blade',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormInputComponent,
    FormDateTimeComponent,
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './calendar-holidays-update-blade.component.html',
  styleUrl: './calendar-holidays-update-blade.component.scss',
})
export class CalendarHolidaysUpdateBladeComponent implements OnInit {
  private readonly apiService = inject(CalendarApiService);
  private readonly calendarSelectedStateService = inject(CalendarSelectedStateService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly bladeService = inject(BladeService);
  private readonly confirmationDialogService = inject(ConfirmationDialogService);

  readonly isLoading = signal(false);
  readonly calendarHoliday = signal<CalendarHolidayResponse | undefined>(undefined);
  readonly loadingDelete = signal(false);

  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };
  readonly calendarState = this.calendarSelectedStateService.state;

  private data!: CalendarHolidaysUpdateDataBlade;

  ngOnInit(): void {
    const data = this.bladeService.bladeState.options().data as CalendarHolidaysUpdateDataBlade;

    if (!data) {
      throw new Error('Data is required for CalendarHolidaysUpdateBlade');
    }

    this.data = data;
    this.loadCalendarHoliday();
  }

  handleCloseBlade(): void {
    this.bladeService.emitResult(false);
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    this.formState.isLoading = true;
    const response = this.mapToResponse();
    this.update(response);
  }

  handleDelete(): void {
    this.loadingDelete.set(true);

    this.confirmationDialogService
      .confirm({
        title: 'Eliminar día festivo',
        message: '¿Estás seguro de que quieres eliminar este día festivo?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      })
      .pipe(
        finalize(() => this.loadingDelete.set(false)),
        filter(Boolean),
        switchMap(() =>
          this.apiService.deleteCalendarHoliday(this.calendarState.calendarId()!, this.data.id).pipe(take(1)),
        ),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Día festivo eliminado correctamente');
          this.bladeService.emitResult(true);
        },
        error: () => {
          this.snackBarService.error('Ha ocurrido un error al eliminar el día festivo');
        },
      });
  }

  private mapToResponse(): CalendarHolidayUpdateRequest {
    const form = this.formState.form.value;
    const response: CalendarHolidayUpdateRequest = {
      name: form.name,
      start: DateTimeUtils.toApiIsoString(form.start),
      end: DateTimeUtils.toApiIsoString(form.end),
    };

    return response;
  }

  private buildForm(): void {
    const calendarHoliday = this.calendarHoliday();

    if (!calendarHoliday) {
      logError('Calendar holiday is not set');

      return;
    }

    this.formState.form = this.formBuilder.group(
      {
        name: [calendarHoliday.name, CalendarHolidayFieldsValidators.name],
        start: [calendarHoliday.start, CalendarHolidayFieldsValidators.start],
        end: [calendarHoliday.end, CalendarHolidayFieldsValidators.end],
      },
      {
        validators: dateStartGreaterThanEndValidator('start', 'end'),
      },
    );
  }

  private update(response: CalendarHolidayUpdateRequest): void {
    this.apiService
      .updateCalendarHoliday(this.calendarState.calendarId()!, this.data.id, response)
      .pipe(
        take(1),
        finalize(() => {
          this.formState.isLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Día festivo actualizado correctamente');
          this.bladeService.emitResult(true);
        },
        error: (error: HttpErrorResponse) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }

  private loadCalendarHoliday(): void {
    this.isLoading.set(true);
    this.apiService
      .getCalendarHolidayById(this.calendarState.calendarId()!, this.data.id)
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.calendarHoliday.set(response);
          this.buildForm();
        },
        error: (error: HttpErrorResponse) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }
}
