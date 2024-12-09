import { HttpStatusCode } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { FormState } from '../../../../core/models/form-state';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormTextareaComponent } from '../../../../shared/components/forms/inputs/form-textarea/form-textarea.component';
import { RoleFormConfig, RoleFormContract } from '../../models/role-form.contract';
import { RoleResponse } from '../../models/role.response';
import { RoleUpdateRequest } from '../../models/update-role.request';
import { AuthorizationApiService } from '../../services/authorization-api.service';

@Component({
  selector: 'am-role-update-dialog',
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
  templateUrl: './role-update-dialog.component.html',
  styleUrl: './role-update-dialog.component.scss',
})
export class RoleUpdateDialogComponent {
  private readonly apiService = inject(AuthorizationApiService);
  private readonly dialogRef = inject(MatDialogRef<RoleUpdateDialogComponent>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBarService = inject(SnackBarService);

  readonly formState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  } as FormState;

  role = {} as RoleResponse;
  loadingRole = true;

  constructor(@Inject(MAT_DIALOG_DATA) private data: { roleId: string }) {
    this.loadRole();
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    const request = this.formState.form.value as RoleUpdateRequest;

    this.apiService
      .updateRole(this.role.id, request)
      .pipe(finalize(() => (this.formState.isLoading = false)))
      .subscribe({
        next: () => {
          this.snackBarService.success('Role actualizado correctamente.');
          this.dialogRef.close(true);
        },
        error: (error) => {
          if (error.status === HttpStatusCode.BadRequest || error.status === HttpStatusCode.Conflict) {
            this.formState.badRequest = error.error;

            return;
          }

          this.snackBarService.error('Ha ocurrido un error al actualizar el role.');
        },
      });
  }

  handleCloseDialog(response: boolean): void {
    this.dialogRef.close(response);
  }

  private loadRole(): void {
    this.loadingRole = true;
    this.apiService
      .getRoleById(this.data.roleId)
      .pipe(finalize(() => (this.loadingRole = false)))
      .subscribe({
        next: (response) => {
          this.role = response;
          this.buildForm();
        },
        error: () => this.snackBarService.error('Ha ocurrido un error al obtener el role.'),
      });
  }

  private buildForm(): void {
    const formContract = {
      name: {
        ...RoleFormConfig.name,
        initialValue: this.role.name,
      },
      description: {
        ...RoleFormConfig.description,
        initialValue: this.role.description,
      },
    } as RoleFormContract;

    this.formState.form = this.formBuilder.group({
      name: [formContract.name.initialValue, formContract.name.validators],
      description: [formContract.description.initialValue, formContract.description.validators],
    });
  }
}
