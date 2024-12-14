import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { FormState } from '../../../../core/models/form-state';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormCheckboxComponent } from '../../../../shared/components/forms/inputs/form-checkbox/form-checkbox.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormRoleSelectorComponent } from '../../../../shared/components/forms/inputs/selectors/form-role-selector/form-role-selector.component';
import { FormInputType } from '../../../../shared/components/forms/models/form-input-type';
import { CustomValidators } from '../../../../shared/components/forms/validators/custom-validators-form';
import { RoleResponse } from '../../../authorization/models/role.response';
import { AccountCreateRequest } from '../../models/account-create.request';
import { AccountApiService } from '../../services/account-api.service';

@Component({
  selector: 'am-account-create-blade',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    FormInputComponent,
    FormRoleSelectorComponent,
    FormCheckboxComponent,
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './account-create-blade.component.html',
  styleUrl: './account-create-blade.component.scss',
})
export class AccountCreateBladeComponent {
  private readonly apiService = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly bladeService = inject(BladeService);

  readonly breadcrumb = new BreadcrumbCollection();
  readonly formState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  } as FormState;
  readonly formInputTypes = FormInputType;

  roles: RoleResponse[] = [];
  loadingRoles = false;

  constructor() {
    this.loadRoles();
  }

  handleCloseBlade(): void {
    this.bladeService.emitResult(false);
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    const request = this.formState.form.value as AccountCreateRequest;
    this.create(request);
  }

  private loadRoles(): void {
    this.loadingRoles = true;

    this.buildForm();
  }

  private buildForm(): void {
    // TODO: Eliminar campos de contraseña y confirmar contraseña.
    this.formState.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, CustomValidators.email]],
        firstName: ['', [Validators.required, Validators.maxLength(100)]],
        lastName: ['', [Validators.required, Validators.maxLength(100)]],
        isCollaborator: [false],
        roles: [[], [CustomValidators.minLengthArray(1)]],
      },
      {
        validators: [CustomValidators.passwordMustMatch('password', 'passwordConfirmation')],
      },
    );
  }

  private create(request: AccountCreateRequest): void {
    this.formState.isLoading = true;

    this.apiService
      .createAccount(request)
      .pipe(finalize(() => (this.formState.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.snackBarService.success('Usuario creado correctamente');
          this.router.navigate([SiteUrls.accounts.accounts, response.userId]);
          this.bladeService.emitResult(true);
        },
        error: (error: HttpErrorResponse) => (this.formState.badRequest = error.error),
      });
  }
}
