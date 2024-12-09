import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { FormState } from '../../../../core/models/form-state';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BreadcrumbCollection } from '../../../../shared/components/breadcrumb/breadcrumb-collection';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumbItem';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormCheckboxComponent } from '../../../../shared/components/forms/inputs/form-checkbox/form-checkbox.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormRoleSelectorComponent } from '../../../../shared/components/forms/inputs/selectors/form-role-selector/form-role-selector.component';
import { FormInputType } from '../../../../shared/components/forms/models/form-input-type';
import { CustomValidators } from '../../../../shared/components/forms/validators/custom-validators-form';
import { PageBaseComponent } from '../../../../shared/components/layout/page-base/page-base.component';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { RoleResponse } from '../../../authorization/models/role.response';
import { AccountCreateRequest } from '../../models/account-create.request';
import { AccountApiService } from '../../services/account-api.service';

@Component({
  selector: 'am-account-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    PageBaseComponent,
    PageHeaderComponent,
    FormInputComponent,
    FormRoleSelectorComponent,
    FormCheckboxComponent,
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './account-create.component.html',
  styleUrl: './account-create.component.scss',
})
export class AccountCreateComponent {
  private readonly apiService = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);

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
    this.setBreadcrumb();
    this.loadRoles();
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    const request = this.formState.form.value as AccountCreateRequest;
    this.create(request);
  }

  private setBreadcrumb(): void {
    this.breadcrumb
      .push(new BreadcrumbItem('Usuarios', SiteUrls.accounts.accounts))
      .push(new BreadcrumbItem('Crear usuario', SiteUrls.accounts.create, '', false));
  }

  private loadRoles(): void {
    this.loadingRoles = true;

    this.buildForm();
  }

  private buildForm(): void {
    this.formState.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, CustomValidators.email]],
        firstName: ['', [Validators.required, Validators.maxLength(100)]],
        lastName: ['', [Validators.required, Validators.maxLength(100)]],
        password: ['', [Validators.required, CustomValidators.strongPassword()]],
        passwordConfirmation: ['', [Validators.required]],
        roles: [[], [CustomValidators.minLengthArray(1)]],
        isActive: [true],
        isEmailConfirmed: [false],
        isCollaborator: [false],
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
        next: () => this.snackBarService.success('Usuario creado correctamente'),
        error: (error: HttpErrorResponse) => (this.formState.badRequest = error.error),
      });
  }
}
