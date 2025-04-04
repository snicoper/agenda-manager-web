import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DateTime } from 'luxon';
import { finalize, take } from 'rxjs';
import { FormState } from '../../../../core/forms/models/form-state.model';
import { HttpErrorResponseMappingUtils } from '../../../../core/http/utils/http-error-response-mapping.utils';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormDateTimeComponent } from '../../../../shared/components/forms/inputs/form-date-time/form-date-time.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { dateStartGreaterThanEndValidator } from '../../../../shared/components/forms/validators/date-start-greater-then-end.validator';
import { CalendarHolidayFieldsValidators } from '../../contracts/calendar-holiday-field-validator.contract';
import { CalendarHolidayCreateRequest } from '../../models/requests/calendar-hoiday-create.request';
import { CalendarApiService } from '../../services/api/calendar-api.service';
import { CalendarSelectedStateService } from '../../services/state/calendar-selected-state.service';

export interface CalendarHolidaysCreateDataBlade {
  dateSelected: DateTime;
}

@Component({
  selector: 'am-calendar-holidays-create-blade',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    FormInputComponent,
    FormDateTimeComponent,
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './calendar-holidays-create-blade.component.html',
  styleUrl: './calendar-holidays-create-blade.component.scss',
})
export class CalendarHolidaysCreateBladeComponent implements OnInit {
  // Injects.
  private readonly apiService = inject(CalendarApiService);
  private readonly calendarSelectedStateService = inject(CalendarSelectedStateService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly bladeService = inject(BladeService);

  // State.
  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };
  readonly calendarState = this.calendarSelectedStateService.state;

  // Internal state.
  private dateSelected!: DateTime;

  ngOnInit(): void {
    const data = this.bladeService.bladeState.options().data as CalendarHolidaysCreateDataBlade;

    if (!data?.dateSelected) {
      throw new Error('Day is required for CalendarHolidaysCreateBlade');
    }

    this.dateSelected = data.dateSelected;
    this.buildForm();
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
    const request = this.mapToRequest();
    this.create(request);
  }

  private buildForm(): void {
    const startValue = DateTime.local().set({
      year: this.dateSelected.year,
      month: this.dateSelected.month,
      day: this.dateSelected.day,
      hour: 0,
      minute: 0,
      second: 0,
    });

    const endValue = DateTime.local().set({
      year: this.dateSelected.year,
      month: this.dateSelected.month,
      day: this.dateSelected.day,
      hour: 23,
      minute: 59,
      second: 59,
    });

    this.formState.form = this.formBuilder.group(
      {
        name: ['', CalendarHolidayFieldsValidators.name],
        start: [startValue, CalendarHolidayFieldsValidators.start],
        end: [endValue, CalendarHolidayFieldsValidators.end],
      },
      {
        validators: dateStartGreaterThanEndValidator('start', 'end'),
      },
    );
  }

  private mapToRequest(): CalendarHolidayCreateRequest {
    const request: CalendarHolidayCreateRequest = {
      name: this.formState.form.value.name,
      start: DateTimeUtils.toApiIsoString(this.formState.form.value.start),
      end: DateTimeUtils.toApiIsoString(this.formState.form.value.end),
    };

    return request;
  }

  private create(request: CalendarHolidayCreateRequest): void {
    this.apiService
      .createCalendarHoliday(this.calendarState.calendarId()!, request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Día festivo creado correctamente');
          this.bladeService.emitResult(true);
        },
        error: (error: HttpErrorResponse) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }
}
