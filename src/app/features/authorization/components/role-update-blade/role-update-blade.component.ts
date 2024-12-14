import { HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { FormState } from '../../../../core/models/form-state';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormTextareaComponent } from '../../../../shared/components/forms/inputs/form-textarea/form-textarea.component';
import { RoleFormConfig, RoleFormContract } from '../../models/role-form.contract';
import { RoleResponse } from '../../models/role.response';
import { RoleUpdateRequest } from '../../models/update-role.request';
import { AuthorizationApiService } from '../../services/authorization-api.service';

@Component({
  selector: 'am-role-update-blade',
  imports: [
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormInputComponent,
    FormTextareaComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './role-update-blade.component.html',
  styleUrl: './role-update-blade.component.scss',
})
export class RoleUpdateBladeComponent {
  private readonly apiService = inject(AuthorizationApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBarService = inject(SnackBarService);
  private readonly bladeService = inject(BladeService);

  readonly formState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  } as FormState;

  role = {} as RoleResponse;
  loadingRole = true;

  constructor() {
    this.loadRole();
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    const request = this.formState.form.value as RoleUpdateRequest;
    this.updateRole(request);
  }

  handleCloseBlade(): void {
    this.bladeService.hide();
  }

  private loadRole(): void {
    this.loadingRole = true;

    this.apiService
      .getRoleById(this.bladeService.bladeState().options.data?.toString() ?? '')
      .pipe(finalize(() => (this.loadingRole = false)))
      .subscribe({
        next: (response) => {
          this.role = response;
          this.buildForm();
        },
        error: () => this.snackBarService.error('Ha ocurrido un error al obtener el role.'),
      });
  }

  private updateRole(request: RoleUpdateRequest): void {
    this.apiService
      .updateRole(this.role.id, request)
      .pipe(finalize(() => (this.formState.isLoading = false)))
      .subscribe({
        next: () => {
          this.snackBarService.success('Role actualizado correctamente.');
          this.bladeService.emitResult<string>(this.role.id);
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
