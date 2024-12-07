import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FormState } from '../../../../core/models/form-state';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormTextareaComponent } from '../../../../shared/components/forms/inputs/form-textarea/form-textarea.component';
import { CreateRoleRequest } from '../../models/create-role.request';
import { RoleFormConfig, RoleFormContract } from '../../models/role-form.contract';
import { AuthorizationApiService } from '../../services/authorization-api.service';

@Component({
  selector: 'am-role-create-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    FormInputComponent,
    FormTextareaComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './role-create-dialog.component.html',
  styleUrl: './role-create-dialog.component.scss',
})
export class RoleCreateDialogComponent {
  private readonly apiService = inject(AuthorizationApiService);
  private readonly dialogRef = inject(MatDialogRef<RoleCreateDialogComponent>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBarService = inject(SnackBarService);

  readonly formState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  } as FormState;

  constructor() {
    this.buildForm();
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    const request = this.formState.form.value as CreateRoleRequest;
    this.create(request);
  }

  private buildForm(): void {
    const formContract = {
      name: { ...RoleFormConfig.name },
      description: { ...RoleFormConfig.description },
    } as RoleFormContract;

    this.formState.form = this.formBuilder.group({
      name: [formContract.name.initialValue, formContract.name.validators],
      description: [formContract.description.initialValue, formContract.description.validators],
    });
  }

  private create(request: CreateRoleRequest): void {
    this.formState.isLoading = true;

    this.apiService.createRole(request).subscribe({
      next: (response) => {
        if (response) {
          this.dialogRef.close(true);
          this.snackBarService.success('Rol creado correctamente.');
        }
      },
      error: (error) => {
        this.formState.badRequest = error.error;
      },
      complete: () => (this.formState.isSubmitted = false),
    });
  }
}
