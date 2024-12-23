import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { FormState } from '../../../../core/models/forms/form-state.interface';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { passwordMustMatchValidator } from '../../../../shared/components/forms/validators/password-must-match.validator';
import { strongPasswordValidator } from '../../../../shared/components/forms/validators/strong-password.validator';
import { PageSimpleComponent } from '../../../../shared/components/layout/page-simple/page-simple.component';
import { HttpErrorResponseMappingUtils } from '../../../../shared/utils/http-error-response-mapping.utils';
import { ConfirmAccountRequest } from '../../models/confirm-account.request';
import { AccountApiService } from '../../services/account-api.service';

@Component({
  selector: 'am-confirm-account',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
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

  validToken = false;

  private token = this.route.snapshot.queryParams['token'];

  constructor() {
    if (this.token) {
      this.validToken = true;
    }

    this.buildForm();
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    this.formState.isLoading = true;
    const request = { ...this.formState.form.value } as ConfirmAccountRequest;
    request.token = this.token;

    this.confirmAccount(request);
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
      .pipe(finalize(() => (this.formState.isLoading = false)))
      .subscribe({
        next: () => {
          this.snackBarService.success('Ha confirmado su cuenta correctamente.');
          this.router.navigateByUrl(SiteUrls.auth.login);
          this.validToken = true;
        },
        error: (error: HttpErrorResponse) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }
}
