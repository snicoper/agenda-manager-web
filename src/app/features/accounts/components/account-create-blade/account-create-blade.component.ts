import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { FormState } from '../../../../core/forms/models/form-state.model';
import { HttpErrorResponseMappingUtils } from '../../../../core/http/utils/http-error-response-mapping.utils';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { FormRoleSelectorComponent } from '../../../../shared/components/forms/inputs/selectors/form-role-selector/form-role-selector.component';
import { AccountFieldsValidators } from '../../contracts/account-fields-validator.contract';
import { AccountCreateRequest, RoleToAdd } from '../../models/requests/account-create.request';
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

    const request = this.mapToRequest();
    this.create(request);
  }

  private mapToRequest(): AccountCreateRequest {
    const request: AccountCreateRequest = {
      email: this.formState.form.value.email,
      firstName: this.formState.form.value.firstName,
      lastName: this.formState.form.value.lastName,
      roles: this.formState.form.value.roles as RoleToAdd[],
    };

    return request;
  }

  private buildForm(): void {
    this.formState.form = this.formBuilder.group({
      email: ['', AccountFieldsValidators.email],
      firstName: ['', AccountFieldsValidators.firstName],
      lastName: ['', AccountFieldsValidators.lastName],
      roles: [[], AccountFieldsValidators.roles],
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
