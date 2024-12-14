import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { SiteUrls } from '../../../../core/config/site-urls';
import { ApiResultErrors } from '../../../../core/errors/api-result-errors';
import { FormFacade } from '../../../../core/form-facade/facade/form.facade';
import { FormFacadeResult } from '../../../../core/form-facade/models/form-facade-result.interface';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/models/form-input-type';
import { CustomValidators } from '../../../../shared/components/forms/validators/custom-validators-form';
import { PageSimpleComponent } from '../../../../shared/components/layout/page-simple/page-simple.component';
import { RequestPasswordReset } from '../../models/request-password-reset.interface';
import { RequestPasswordResetRequest } from '../../models/request-password-reset.request';
import { AccountApiService } from '../../services/account-api.service';

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
  private readonly formFacade = inject(FormFacade);

  readonly formRequestPasswordReset = this.buildFormFacade();
  readonly formInputType = FormInputType;
  readonly siteUrls = SiteUrls;

  // Alert.
  alertState = {
    isSuccess: false,
    show: false,
    type: undefined,
    message: undefined,
  } as AlertState;

  private readonly ERROR_MESSAGES = {
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

  handleSubmit(): void {
    this.formRequestPasswordReset.submit(() =>
      this.apiService.requestPasswordReset(this.formRequestPasswordReset.form.value as RequestPasswordResetRequest),
    );
  }

  private buildFormFacade(): FormFacadeResult<RequestPasswordReset> {
    const formFacade = this.formFacade.createForm<RequestPasswordReset>({
      fields: {
        email: {
          value: '',
          validators: [Validators.required, CustomValidators.email],
          component: {
            type: 'email',
            label: 'Email',
            icon: 'email',
          },
        },
      },
      reset: () => {
        this.formRequestPasswordReset.state().badRequest = undefined;
        this.formRequestPasswordReset.state().isSubmitted = false;

        this.alertState = {
          isSuccess: false,
          show: false,
          type: undefined,
          message: undefined,
        };
      },
      onSuccess: () => {
        this.setAlertSuccessState('Se ha enviado un correo con las instrucciones para restablecer la contraseña');
      },
      onError: (error: HttpErrorResponse) => {
        const errorConfig = this.ERROR_MESSAGES[error.error.code];

        if (errorConfig && error.status === errorConfig.expectedStatus) {
          this.setAlertErrorState(errorConfig.message);

          return;
        }

        this.formRequestPasswordReset.state().badRequest = error.error;
      },
    });

    return formFacade;
  }

  private setAlertErrorState(message: string): void {
    this.alertState = {
      isSuccess: false,
      show: true,
      type: 'error',
      message,
    } as AlertState;
  }

  private setAlertSuccessState(message: string): void {
    this.alertState = {
      isSuccess: true,
      show: true,
      type: 'success',
      message,
    } as AlertState;
  }
}
