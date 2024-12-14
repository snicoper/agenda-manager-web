import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { FormState } from '../../../../core/models/form-state';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormTextareaComponent } from '../../../../shared/components/forms/inputs/form-textarea/form-textarea.component';
import { CreateRoleRequest } from '../../models/create-role.request';
import { RoleFormConfig, RoleFormContract } from '../../models/role-form.contract';
import { AuthorizationApiService } from '../../services/authorization-api.service';

@Component({
  selector: 'am-role-create-blade',
  imports: [
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    FormInputComponent,
    FormTextareaComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './role-create-blade.component.html',
  styleUrl: './role-create-blade.component.scss',
})
export class RoleCreateBladeComponent {
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

  constructor() {
    this.buildForm();
  }

  handleCloseBlade(): void {
    this.bladeService.emitResult(false);
    this.bladeService.hide();
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

    this.apiService
      .createRole(request)
      .pipe(finalize(() => (this.formState.isSubmitted = false)))
      .subscribe({
        next: (result) => {
          if (result) {
            this.bladeService.emitResult(result);
            this.bladeService.hide();
            this.snackBarService.success('Rol creado correctamente.');
          }
        },
        error: (error) => (this.formState.badRequest = error.error),
      });
  }
}
