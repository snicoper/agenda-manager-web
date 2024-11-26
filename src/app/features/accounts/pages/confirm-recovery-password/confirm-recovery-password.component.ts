import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { BadRequest } from '../../../../core/models/bad-request';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/models/form-input-type';
import { CustomValidators } from '../../../../shared/components/forms/validators/custom-validators-form';
import { PageSimpleComponent } from '../../../../shared/components/pages/page-simple/page-simple.component';
import { RecoveryConfirmPasswordRequest } from '../../models/recovery-confirm-password-request';
import { AccountApiService } from '../../services/account-api.service';

@Component({
  selector: 'am-confirm-recovery-password',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDivider,
    PageSimpleComponent,
    FormInputComponent,
    BtnLoadingComponent,
    NonFieldErrorsComponent,
  ],
  templateUrl: './confirm-recovery-password.component.html',
  styleUrl: './confirm-recovery-password.component.scss',
})
export class ConfirmRecoveryPasswordComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly accountApiService = inject(AccountApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBarService = inject(SnackBarService);

  private token = this.route.snapshot.queryParams['token'];

  readonly siteUrls = SiteUrls;
  readonly formInputType = FormInputType;

  form: FormGroup = this.formBuilder.group({});
  badRequest: BadRequest | undefined;
  isSubmitted = false;
  isLoading = false;

  constructor() {
    this.buildForm();
  }

  handleSubmit(): void {
    this.isSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const request = this.form.value as RecoveryConfirmPasswordRequest;
    request.token = this.token;

    this.accountApiService
      .confirmRecoveryPassword(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.snackBarService.success('La contraseña se ha actualizado correctamente.');
          this.router.navigate([SiteUrls.auth.login]);
        },
        error: (error: HttpErrorResponse) => {
          this.badRequest = error.error;
        },
      });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group(
      {
        newPassword: ['', [Validators.required, CustomValidators.strongPassword()]],
        confirmNewPassword: ['', [Validators.required]],
      },
      {
        validators: CustomValidators.passwordMustMatch('newPassword', 'confirmNewPassword'),
      },
    );
  }
}
