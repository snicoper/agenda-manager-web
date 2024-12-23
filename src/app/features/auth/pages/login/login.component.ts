import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { LoginRequest } from '../../../../core/auth/interfaces/requests/login.request';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { SiteUrls } from '../../../../core/config/site-urls';
import { ApiResultErrors } from '../../../../core/errors/api-result-errors';
import { FormState } from '../../../../core/interfaces/forms/form-state.interface';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { emailValidator } from '../../../../shared/components/forms/validators/email.validator';
import { PageSimpleComponent } from '../../../../shared/components/layout/page-simple/page-simple.component';

@Component({
  selector: 'am-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatDivider,
    PageSimpleComponent,
    FormInputComponent,
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly returnUrl = this.route.snapshot.queryParams['returnUrl'];

  readonly siteUrls = SiteUrls;
  readonly formInputType = FormInputType;

  readonly formSate: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };

  constructor() {
    this.buildForm();
  }

  handleSubmit(): void {
    this.authService.logout();
    this.formSate.isSubmitted = true;

    if (this.formSate.form.invalid) {
      return;
    }

    this.formSate.isLoading = true;
    const request = this.formSate.form.value as LoginRequest;

    this.authService
      .login(request)
      .pipe(finalize(() => (this.formSate.isLoading = false)))
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl ?? SiteUrls.home], { replaceUrl: true });
        },
        error: (error: HttpErrorResponse) => {
          this.formSate.badRequest = error.error;

          if (
            error.status === HttpStatusCode.Conflict &&
            this.formSate.badRequest?.code === ApiResultErrors.users.emailIsNotConfirmed
          ) {
            // Redirect to confirm email page.
            this.router.navigate([SiteUrls.accounts.resendEmailConfirmation], {
              queryParams: { email: request.email },
            });
          }
        },
      });
  }

  private buildForm(): void {
    this.formSate.form = this.formBuilder.group({
      email: ['', [Validators.required, emailValidator()]],
      password: ['', [Validators.required]],
    });
  }
}
