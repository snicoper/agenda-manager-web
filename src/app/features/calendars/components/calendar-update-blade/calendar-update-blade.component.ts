import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, take } from 'rxjs';
import { logError } from '../../../../core/errors/logger/logger';
import { FormState } from '../../../../core/forms/interfaces/form-state.interface';
import { HttpErrorResponseMappingUtils } from '../../../../core/http/utils/http-error-response-mapping.utils';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { CalendarFieldsValidators } from '../../contracts/calendar-fields-valildators.contract';
import { CalendarUpdateRequest } from '../../interfaces/requests/calendar-update-request';
import { CalendarApiService } from '../../services/api/calendar-api.service';
import { CalendarDetailsStateService } from '../../services/state/calendar-details-state.service';

@Component({
  selector: 'am-calendar-update-blade',
  imports: [
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    FormInputComponent,
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './calendar-update-blade.component.html',
  styleUrl: './calendar-update-blade.component.scss',
})
export class CalendarUpdateBladeComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(CalendarApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly bladeService = inject(BladeService);
  private readonly calendarDetailsStateService = inject(CalendarDetailsStateService);

  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };
  readonly formInputTypes = FormInputType;
  readonly calendarState = this.calendarDetailsStateService.state;

  ngOnInit(): void {
    setTimeout(() => {
      // Force an extra change detection cycle for Material initialization.
    }, 0);

    // Continue with normal initialization.
    this.loadCalendar();
  }

  ngOnDestroy(): void {
    this.bladeService.hide();
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
    this.update(request);
  }

  private mapToRequest(): CalendarUpdateRequest {
    const request: CalendarUpdateRequest = {
      name: this.formState.form.value.name,
      description: this.formState.form.value.description,
    };

    return request;
  }

  private update(request: CalendarUpdateRequest): void {
    if (!this.calendarState.calendarId()) {
      logError('CalendarUpdateBladeComponent.update', 'Calendar ID is not set.');

      return;
    }

    this.formState.isLoading = true;

    this.apiService
      .updateCalendar(this.calendarState.calendarId()!, request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Calendario actualizado con éxito');
          this.calendarDetailsStateService.refresh();
          this.bladeService.emitResult(true);
        },
        error: (error) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }

  private loadCalendar(): void {
    this.calendarDetailsStateService.refresh();
    this.buildForm();
  }

  private buildForm(): void {
    const nameValue = this.calendarState.calendar()?.name ?? '';
    const descriptionValue = this.calendarState.calendar()?.description ?? '';

    this.formState.form = this.formBuilder.group({
      name: [nameValue, CalendarFieldsValidators.name],
      description: [descriptionValue, CalendarFieldsValidators.description],
    });
  }
}
