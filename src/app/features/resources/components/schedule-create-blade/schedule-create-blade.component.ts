import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DateTime } from 'luxon';
import { FormState } from '../../../../core/forms/models/form-state.model';
import { HttpErrorResponseMappingUtils } from '../../../../core/http/utils/http-error-response-mapping.utils';
import { WeekDay } from '../../../../core/modules/week-days/week-days.type';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { ScheduleFieldsValidators } from '../../contracts/schedule-fields-validator.contract';
import { ScheduleCreateRequest } from '../../models/requests/schedule-create.request';
import { ResourceApiService } from '../../services/api/resource-api.service';
import { ResourceSelectedStateService } from '../../services/state/resource-selected-state.service';
import { ResourceScheduleType } from '../../../../core/modules/resource-management/resource-schedule-type/resource-schedule-type.enum';

@Component({
  selector: 'am-schedule-create-blade',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    FormInputComponent,
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
    return {
      name: this.formState.form.value.name,
      description: this.formState.form.value.description,
      type: this.formState.form.value.type as ResourceScheduleType,
      availableDays: this.formState.form.value.availableDays as WeekDay,
      start: this.formState.form.value.start as DateTime,
      end: this.formState.form.value.end as DateTime,
    };
  }

  private buildForm(): void {
    this.formState.form = this.formBuilder.group({
      name: ['', ScheduleFieldsValidators.name],
      description: ['', ScheduleFieldsValidators.description],
      type: [null, ScheduleFieldsValidators.type],
      availableDays: [null, ScheduleFieldsValidators.availableDays],
      start: [null, ScheduleFieldsValidators.start],
      end: [null, ScheduleFieldsValidators.end],
    });
  }

  private create(request: ScheduleCreateRequest): void {
    this.formState.isLoading = true;

    this.apiService.createSchedule(this.resourceSelectedStateService.state.resourceId()!, request).subscribe({
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
