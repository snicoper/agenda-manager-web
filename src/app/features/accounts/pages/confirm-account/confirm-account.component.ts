import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { FormState } from '../../../../core/forms/models/form-state.model';
import { HttpErrorResponseMappingUtils } from '../../../../core/http/utils/http-error-response-mapping.utils';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { passwordMustMatchValidator } from '../../../../shared/components/forms/validators/password-must-match.validator';
import { strongPasswordValidator } from '../../../../shared/components/forms/validators/strong-password.validator';
import { PageSimpleComponent } from '../../../../shared/components/layout/page-simple/page-simple.component';
import { ConfirmAccountRequest } from '../../models/requests/confirm-account.request';
import { AccountApiService } from '../../services/api/account-api.service';

@Component({
  selector: 'am-confirm-account',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    PageSimpleComponent,
    FormInputComponent,
    BtnLoadingComponent,
    NonFieldErrorsComponent,
    AlertComponent,
  ],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.scss',
})
export class ConfirmAccountComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiService = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);

  readonly siteUrls = SiteUrls;
  readonly formInputType = FormInputType;
  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isLoading: false,
    isSubmitted: false,
  };
  readonly validToken = signal(false);

  private token = this.route.snapshot.queryParams['token'];

  constructor() {
    if (this.token) {
      this.validToken.set(true);
    }

    this.buildForm();
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    const request = this.mapToRequest();
    this.confirmAccount(request);
  }

  private mapToRequest(): ConfirmAccountRequest {
    const request: ConfirmAccountRequest = {
      newPassword: this.formState.form.value.newPassword,
      confirmNewPassword: this.formState.form.value.confirmNewPassword,
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

  private confirmAccount(request: ConfirmAccountRequest): void {
    this.formState.isLoading = true;

    this.apiService
      .confirmAccount(request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Ha confirmado su cuenta correctamente.');
          this.router.navigateByUrl(SiteUrls.auth.login);
          this.validToken.set(true);
        },
        error: (error: HttpErrorResponse) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }
}
