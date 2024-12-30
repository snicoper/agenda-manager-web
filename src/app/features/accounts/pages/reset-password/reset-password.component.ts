import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { FormState } from '../../../../core/forms/interfaces/form-state.interface';
import { HttpErrorResponseMappingUtils } from '../../../../core/http/utils/http-error-response-mapping.utils';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { passwordMustMatchValidator } from '../../../../shared/components/forms/validators/password-must-match.validator';
import { strongPasswordValidator } from '../../../../shared/components/forms/validators/strong-password.validator';
import { PageSimpleComponent } from '../../../../shared/components/layout/page-simple/page-simple.component';
import { ResetPasswordRequest } from '../../interfaces/requests/reset-password.request';
import { AccountApiService } from '../../services/api/account-api.service';

@Component({
  selector: 'am-reset-password',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDivider,
    MatIconModule,
    PageSimpleComponent,
    FormInputComponent,
    BtnLoadingComponent,
    NonFieldErrorsComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(AccountApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBarService = inject(SnackBarService);

  readonly siteUrls = SiteUrls;
  readonly formInputType = FormInputType;
  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };

  private token = this.route.snapshot.queryParams['token'];

  constructor() {
    this.buildForm();
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    const request = this.mapToRequest();
    this.confirmRecoveryPassword(request);
  }

  private mapToRequest(): ResetPasswordRequest {
    const request: ResetPasswordRequest = {
      newPassword: this.formState.form.value.newPassword,
      confirmNewPassword: this.formState.form.value.confirm,
      token: this.token,
    };

    return request;
  }

  private buildForm(): void {
    this.formState.form = this.formBuilder.group(
      {
        newPassword: ['', [Validators.required, strongPasswordValidator()]],
        confirmNewPassword: ['', [Validators.required]],
      },
      {
        validators: passwordMustMatchValidator('newPassword', 'confirmNewPassword'),
      },
    );
  }

  private confirmRecoveryPassword(request: ResetPasswordRequest): void {
    this.formState.isLoading = true;

    this.apiService
      .resetPassword(request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('La contraseña se ha actualizado correctamente.');
          this.router.navigate([SiteUrls.auth.login]);
        },
        error: (error: HttpErrorResponse) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }
}
