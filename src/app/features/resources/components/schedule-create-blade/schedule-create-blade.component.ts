import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DateTime } from 'luxon';
import { finalize, take } from 'rxjs';
import { FormState } from '../../../../core/forms/models/form-state.model';
import { HttpErrorResponseMappingUtils } from '../../../../core/http/utils/http-error-response-mapping.utils';
import { ResourceScheduleType } from '../../../../core/modules/resource-management/resource-schedule-type/resource-schedule-type.enum';
import { WeekDay } from '../../../../core/modules/week-days/week-days.type';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { DateTimeUtils } from '../../../../core/utils/date/datetime.utils';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormDateTimeComponent } from '../../../../shared/components/forms/inputs/form-date-time/form-date-time.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { FormTextareaComponent } from '../../../../shared/components/forms/inputs/form-textarea/form-textarea.component';
import { FormWorkingDaysWeekComponent } from '../../../../shared/components/forms/inputs/form-working-days-week/form-working-days-week.component';
import { FormResourceScheduleTypeSelectorComponent } from '../../../../shared/components/forms/inputs/selectors/form-resource-schedule-type-selector/form-resource-schedule-type-selector.component';
import { dateStartGreaterThanEndValidator } from '../../../../shared/components/forms/validators/date-start-greater-then-end.validator';
import { ScheduleFieldsValidators } from '../../contracts/schedule-fields-validator.contract';
import { ScheduleCreateRequest } from '../../models/requests/schedule-create.request';
import { ResourceApiService } from '../../services/api/resource-api.service';
import { ResourceSelectedStateService } from '../../services/state/resource-selected-state.service';

@Component({
  selector: 'am-schedule-create-blade',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    FormInputComponent,
    FormTextareaComponent,
    FormResourceScheduleTypeSelectorComponent,
    FormDateTimeComponent,
    FormWorkingDaysWeekComponent,
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './schedule-create-blade.component.html',
  styleUrl: './schedule-create-blade.component.scss',
})
export class ScheduleCreateBladeComponent implements OnInit {
  private readonly apiService = inject(ResourceApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly bladeService = inject(BladeService);
  private readonly resourceSelectedStateService = inject(ResourceSelectedStateService);

  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };
  readonly formInputTypes = FormInputType;

  ngOnInit(): void {
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

    const request = this.mapToRequest();
    this.create(request);
  }

  private mapToRequest(): ScheduleCreateRequest {
    const startValue = this.formState.form.value.start as DateTime;
    const endValue = this.formState.form.value.end as DateTime;

    const request: ScheduleCreateRequest = {
      name: this.formState.form.value.name,
      description: this.formState.form.value.description,
      type: this.formState.form.value.type as ResourceScheduleType,
      availableDays: this.formState.form.value.availableDays as WeekDay,
      start: DateTimeUtils.toApiIsoString(startValue),
      end: DateTimeUtils.toApiIsoString(endValue),
    };

    return request;
  }

  private buildForm(): void {
    const startValue = DateTime.local().startOf('day');
    const endValue = DateTime.local().plus({ year: 1 }).endOf('day');

    this.formState.form = this.formBuilder.group(
      {
        name: ['', ScheduleFieldsValidators.name],
        description: ['', ScheduleFieldsValidators.description],
        type: [null, ScheduleFieldsValidators.type],
        availableDays: [null, ScheduleFieldsValidators.availableDays],
        start: [startValue, ScheduleFieldsValidators.start],
        end: [endValue, ScheduleFieldsValidators.end],
      },
      {
        validators: dateStartGreaterThanEndValidator('start', 'end'),
      },
    );
  }

  private create(request: ScheduleCreateRequest): void {
    this.formState.isLoading = true;

    this.apiService
      .createSchedule(this.resourceSelectedStateService.state.resourceId()!, request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Horario creado correctamente');
          this.bladeService.emitResult(true);
        },
        error: (error: HttpErrorResponse) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }
}
