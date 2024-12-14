import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../../../core/auth/models/login.request';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { SiteUrls } from '../../../../core/config/site-urls';
import { ApiResultErrors } from '../../../../core/errors/api-result-errors';
import { FormFacade } from '../../../../core/form-facade/facade/form.facade';
import { FormFacadeResult } from '../../../../core/form-facade/models/form-facade-result.interface';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/models/form-input-type';
import { CustomValidators } from '../../../../shared/components/forms/validators/custom-validators-form';
import { PageSimpleComponent } from '../../../../shared/components/layout/page-simple/page-simple.component';
import { LoginFormFields } from './models/login-form.-fields-interface';

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
  private readonly formFacade = inject(FormFacade);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly returnUrl = this.route.snapshot.queryParams['returnUrl'];

  readonly siteUrls = SiteUrls;
  readonly formInputType = FormInputType;

  readonly formLogin = this.buildFormFacade();

  handleSubmit(): void {
    this.authService.logout();
    this.formLogin.submit(() => this.authService.login(this.formLogin.form.value as LoginRequest));
  }

  private buildFormFacade(): FormFacadeResult<LoginFormFields> {
    const formFacade = this.formFacade.createForm<LoginFormFields>({
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
        password: {
          value: '',
          validators: [Validators.required],
          component: {
            type: 'password',
            label: 'Contraseña',
            icon: 'lock',
          },
        },
      },
      onSuccess: () => {
        this.router.navigate([this.returnUrl ?? SiteUrls.home], { replaceUrl: true });
      },
      onError: (error: HttpErrorResponse) => {
        if (
          error.status === HttpStatusCode.Conflict &&
          error.error?.code === ApiResultErrors.users.emailIsNotConfirmed
        ) {
          const email = this.formLogin.getFieldValue('email') as string;
          this.router.navigate([SiteUrls.accounts.resendEmailConfirmation], {
            queryParams: { email },
          });
        }
      },
    });

    return formFacade;
  }
}
