import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { TimeZoneState } from '../../../../core/i18n/states/time-zone.state';
import { FormState } from '../../../../core/models/forms/form-state.interface';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { FormTextareaComponent } from '../../../../shared/components/forms/inputs/form-textarea/form-textarea.component';
import { FormTimeZoneSelectorComponent } from '../../../../shared/components/forms/inputs/selectors/form-time-zone-selector/form-time-zone-selector.component';
import { HttpErrorResponseMappingUtils } from '../../../../shared/utils/http/http-error-response-mapping.utils';
import { UrlUtils } from '../../../../shared/utils/url/url.utils';
import { CalendarCreateRequest } from '../../models/calendar-create.request';
import { CalendarApiService } from '../../services/calendar-api.service';

@Component({
  selector: 'am-calendar-create-blade',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    NonFieldErrorsComponent,
    FormInputComponent,
    FormTextareaComponent,
    FormTimeZoneSelectorComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './calendar-create-blade.component.html',
  styleUrl: './calendar-create-blade.component.scss',
})
export class CalendarCreateBladeComponent implements OnInit {
  private readonly apiService = inject(CalendarApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly bladeService = inject(BladeService);
  private readonly timeZoneState = inject(TimeZoneState);

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

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    const request: CalendarCreateRequest = this.formState.form.value;
    this.create(request);
  }

  handleCloseBlade(): void {
    this.bladeService.emitResult(false);
  }

  private buildForm(): void {
    this.formState.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      ianaTimeZone: [this.timeZoneState.get(), [Validators.required]],
    });
  }

  private create(request: CalendarCreateRequest): void {
    this.formState.isLoading = true;
    this.apiService
      .createCalendar(request)
      .pipe(finalize(() => (this.formState.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.snackBarService.success('Calendar created successfully.');
          this.bladeService.emitResult(true);
          this.router.navigateByUrl(UrlUtils.buildSiteUrl(SiteUrls.calendars.details, { id: response }));
        },
        error: (error) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }
}
