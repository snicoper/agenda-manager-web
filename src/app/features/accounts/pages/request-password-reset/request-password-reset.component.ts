import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { ApiResultErrors } from '../../../../core/errors/api-result-errors';
import { FormState } from '../../../../core/forms/interfaces/form-state.interface';
import { HttpErrorResponseMappingUtils } from '../../../../core/utils/http/http-error-response-mapping.utils';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { emailValidator } from '../../../../shared/components/forms/validators/email.validator';
import { PageSimpleComponent } from '../../../../shared/components/layout/page-simple/page-simple.component';
import { RequestPasswordResetRequest } from '../../interfaces/requests/request-password-reset.request';
import { AccountApiService } from '../../services/api/account-api.service';

interface AlertState {
  isSuccess: boolean;
  show: boolean;
  type: 'success' | 'error' | undefined;
  message: string | undefined;
}

@Component({
  selector: 'am-request-password-reset',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDivider,
    MatIconModule,
    PageSimpleComponent,
    FormInputComponent,
    BtnLoadingComponent,
    NonFieldErrorsComponent,
    AlertComponent,
  ],
  templateUrl: './request-password-reset.component.html',
  styleUrl: './request-password-reset.component.scss',
})
export class RequestPasswordResetComponent {
  private readonly apiService = inject(AccountApiService);
  private readonly formBuilder = inject(FormBuilder);

  private readonly ErrorMessages = {
    [ApiResultErrors.users.userIsNotActive]: {
      message: 'Su cuenta no está activa. Contacte con el administrador',
      expectedStatus: HttpStatusCode.Conflict,
    },
    [ApiResultErrors.users.emailIsNotConfirmed]: {
      message: 'Su cuenta esta pendiente de confirmación. Revise su correo',
      expectedStatus: HttpStatusCode.Conflict,
    },
    [ApiResultErrors.users.userNotFound]: {
      message: 'El correo electrónico no está registrado',
      expectedStatus: HttpStatusCode.NotFound,
    },
  };

  readonly siteUrls = SiteUrls;
  readonly formInputType = FormInputType;
  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isLoading: false,
    isSubmitted: false,
  };

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
    this.formState.badRequest = undefined;
    this.formState.isSubmitted = false;

    this.alertState = {
      isSuccess: false,
      show: false,
      type: undefined,
      message: undefined,
    };
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    this.formState.isLoading = true;
    const request: RequestPasswordResetRequest = this.formState.form.value;

    this.apiService
      .requestPasswordReset(request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.setAlertSuccessState('Se ha enviado un correo electrónico con un enlace para recuperar la contraseña');
          }
        },
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
  }

  private handleError(error: HttpErrorResponse): void {
    const errorConfig = this.ErrorMessages[error.error.code];

    if (errorConfig && error.status === errorConfig.expectedStatus) {
      this.setAlertErrorState(errorConfig.message);

      return;
    }

    const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
    this.formState.badRequest = badRequest;
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
    this.formState.form = this.formBuilder.group({
      email: ['', [Validators.required, emailValidator()]],
    });
  }
}
