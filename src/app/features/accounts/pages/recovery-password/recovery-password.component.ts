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
import { SystemErrors } from '../../../../core/errors/system-errors';
import { BadRequest } from '../../../../core/models/bad-request';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/models/form-input-type';
import { CustomValidators } from '../../../../shared/components/forms/validators/custom-validators-form';
import { PageSimpleComponent } from '../../../../shared/components/pages/page-simple/page-simple.component';
import { RecoveryPasswordRequest } from '../../models/recovery-password.request';
import { AccountApiService } from '../../services/account-api.service';

interface AlertState {
  isSuccess: boolean;
  show: boolean;
  type: 'success' | 'error' | undefined;
  message: string | undefined;
}

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

  private readonly ERROR_MESSAGES = {
    [SystemErrors.users.userIsNotActive]: {
      message: 'Su cuenta está bloqueada. Contacta con soporte',
      expectedStatus: HttpStatusCode.Conflict,
    },
    [SystemErrors.users.emailIsNotConfirmed]: {
      message: 'Su cuenta no está confirmada. Revise su correo',
      expectedStatus: HttpStatusCode.Conflict,
    },
    [SystemErrors.users.userNotFound]: {
      message: 'Usuario no encontrado',
      expectedStatus: HttpStatusCode.NotFound,
    },
  };

  readonly siteUrls = SiteUrls;
  readonly formInputType = FormInputType;

  form: FormGroup = this.formBuilder.group({});
  badRequest: BadRequest | undefined;
  isSubmitted = false;
  isLoading = false;

  // Alert.
  alertState: AlertState = {
    isSuccess: false,
    show: false,
    type: undefined,
    message: undefined,
  };

  constructor() {
    this.buildForm();
  }

  handleResetForm(): void {
    this.badRequest = undefined;
    this.isSubmitted = false;

    this.alertState = {
      isSuccess: false,
      show: false,
      type: undefined,
      message: undefined,
    };
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
            this.setAlertSuccessState('Se ha enviado un correo electrónico con un enlace para recuperar su contraseña');
          }
        },
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
  }

  private handleError(error: HttpErrorResponse): void {
    const errorConfig = this.ERROR_MESSAGES[error.error.code];

    if (errorConfig && error.status === errorConfig.expectedStatus) {
      this.setAlertErrorState(errorConfig.message);

      return;
    }

    this.badRequest = error.error;
  }

  private setAlertErrorState(message: string): void {
    this.alertState = {
      isSuccess: false,
      show: true,
      type: 'error',
      message,
    };
  }

  private setAlertSuccessState(message: string): void {
    this.alertState = {
      isSuccess: true,
      show: true,
      type: 'success',
      message,
    };
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, CustomValidators.email]],
    });
  }
}
