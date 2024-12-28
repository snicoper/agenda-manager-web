import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { FormState } from '../../../../core/modules/forms/interfaces/form-state.interface';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { FormRoleSelectorComponent } from '../../../../shared/components/forms/inputs/selectors/form-role-selector/form-role-selector.component';
import { emailValidator } from '../../../../shared/components/forms/validators/email.validator';
import { minLengthArrayValidator } from '../../../../shared/components/forms/validators/min-length-array.validator';
import { HttpErrorResponseMappingUtils } from '../../../../shared/utils/http/http-error-response-mapping.utils';
import { AccountCreateRequest } from '../../interfaces/requests/account-create.request';
import { AccountApiService } from '../../services/api/account-api.service';

@Component({
  selector: 'am-account-create-blade',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    FormInputComponent,
    FormRoleSelectorComponent,
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './account-create-blade.component.html',
  styleUrl: './account-create-blade.component.scss',
})
export class AccountCreateBladeComponent implements OnInit {
  private readonly apiService = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly bladeService = inject(BladeService);

  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };
  readonly formInputTypes = FormInputType;

  loadingRoles = false;

  ngOnInit(): void {
    this.buildForm();
  }

  handleCloseBlade(): void {
    this.bladeService.emitResult(false);
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    const request: AccountCreateRequest = this.formState.form.value;
    this.create(request);
  }

  private buildForm(): void {
    this.formState.form = this.formBuilder.group({
      email: ['', [Validators.required, emailValidator()]],
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      roles: [[], [minLengthArrayValidator(1)]],
    });
  }

  private create(request: AccountCreateRequest): void {
    this.formState.isLoading = true;

    this.apiService
      .createAccount(request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: (response) => {
          this.snackBarService.success('Usuario creado correctamente');
          this.bladeService.emitResult(true);
          this.router.navigate([SiteUrls.accounts.list, response.userId]);
        },
        error: (error: HttpErrorResponse) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }
}
