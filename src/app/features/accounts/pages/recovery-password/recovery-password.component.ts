import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { BadRequest } from '../../../../core/models/bad-request';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/models/form-input-type';
import { CustomValidators } from '../../../../shared/components/forms/validators/custom-validators-form';
import { PageSimpleComponent } from '../../../../shared/components/pages/page-simple/page-simple.component';
import { RecoveryPasswordRequest } from '../models/recovery-password-request';
import { AccountApiService } from '../services/account-api.service';

@Component({
  selector: 'am-recovery-password',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDivider,
    PageSimpleComponent,
    FormInputComponent,
    BtnLoadingComponent,
    NonFieldErrorsComponent,
    AlertComponent,
  ],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.scss',
})
export class RecoveryPasswordComponent {
  private readonly accountApiService = inject(AccountApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly siteUrls = SiteUrls;
  readonly formInputType = FormInputType;

  form: FormGroup = this.formBuilder.group({});
  badRequest: BadRequest | undefined;
  isSubmitted = false;
  isLoading = false;

  // Alert.
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'danger' | undefined;
  responseValue = false;

  constructor() {
    this.buildForm();
  }

  handleResetForm(): void {
    this.badRequest = undefined;
    this.isSubmitted = false;
    this.showAlert = false;
    this.alertMessage = '';
    this.alertType = undefined;
    this.responseValue = false;
  }

  handleSubmit(): void {
    this.isSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const request = this.form.value as RecoveryPasswordRequest;

    this.accountApiService
      .recoveryPassword(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response) {
            this.showAlert = true;
            this.alertMessage = 'Email sent successfully';
            this.alertType = 'success';
            this.responseValue = response;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.badRequest = error.error;

          if (error.status === HttpStatusCode.NotFound) {
            this.showAlert = true;
            this.alertMessage = 'Email not found';
            this.alertType = 'danger';
            this.responseValue = false;
          }
        },
      });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, CustomValidators.email]],
    });
  }
}
