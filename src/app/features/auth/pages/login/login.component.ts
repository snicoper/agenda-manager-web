import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { LoginRequest } from '../../../../core/auth/models/login.request';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { SiteUrls } from '../../../../core/config/site-urls';
import { BadRequest } from '../../../../core/models/bad-request';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/models/form-input-type';
import { CustomValidators } from '../../../../shared/components/forms/validators/custom-validators-form';
import { PageSimpleComponent } from '../../../../shared/components/pages/page-simple/page-simple.component';

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

  form: FormGroup = this.formBuilder.group({});
  badRequest: BadRequest | undefined;
  isSubmitted = false;
  isLoading = false;

  constructor() {
    this.buildForm();
  }

  handleSubmit(): void {
    this.authService.logout();
    this.isSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const request = this.form.value as LoginRequest;

    this.authService
      .login(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl ?? '/'], { replaceUrl: true });
        },
        error: (error: HttpErrorResponse) => {
          this.badRequest = error.error;

          if (error.status === HttpStatusCode.Conflict && this.badRequest?.code === 'UserErrors.EmailIsNotConfirmed') {
            // Redirect to resent email verification.
            this.router.navigate(['/accounts/email-code-resent'], {
              queryParams: { email: request.email },
            });
          }
        },
      });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, CustomValidators.email]],
      password: ['', [Validators.required]],
    });
  }
}
