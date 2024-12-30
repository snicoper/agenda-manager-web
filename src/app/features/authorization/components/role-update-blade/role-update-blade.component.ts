import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, take } from 'rxjs';
import { FormState } from '../../../../core/forms/interfaces/form-state.interface';
import { HttpErrorResponseMappingUtils } from '../../../../core/http/utils/http-error-response-mapping.utils';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormTextareaComponent } from '../../../../shared/components/forms/inputs/form-textarea/form-textarea.component';
import { RoleFieldsValidators } from '../../contracts/role-fields-validators.contract';
import { RoleUpdateRequest } from '../../interfaces/requests/update-role.request';
import { AuthorizationApiService } from '../../services/api/authorization-api.service';
import { RoleSelectedStateService } from '../../services/state/role-selected-state.service';

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
export class RoleUpdateBladeComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(AuthorizationApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBarService = inject(SnackBarService);
  private readonly bladeService = inject(BladeService);
  private readonly roleSelectedStateService = inject(RoleSelectedStateService);

  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };

  readonly roleSelectedState = this.roleSelectedStateService.state;

  ngOnInit(): void {
    setTimeout(() => {
      // Force an extra change detection cycle for Material initialization.
      // @see BladeComponent for more information.
    });

    this.loadRole();
  }

  ngOnDestroy(): void {
    this.bladeService.hide();
  }

  handleCloseBlade(): void {
    this.bladeService.hide();
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    const request = this.mapToRequest();
    this.updateRole(request);
  }

  private mapToRequest(): RoleUpdateRequest {
    const request: RoleUpdateRequest = {
      name: this.formState.form.value.name,
      description: this.formState.form.value.description,
    };

    return request;
  }

  private loadRole(): void {
    this.roleSelectedStateService.refresh();
    this.buildForm();
  }

  private updateRole(request: RoleUpdateRequest): void {
    this.apiService
      .updateRole(this.roleSelectedState.roleId()!, request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Role actualizado correctamente.');
          this.roleSelectedStateService.refresh();
          this.bladeService.emitResult(true);
        },
        error: (error) => {
          if (error.status === HttpStatusCode.BadRequest || error.status === HttpStatusCode.Conflict) {
            const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
            this.formState.badRequest = badRequest;

            return;
          }

          this.snackBarService.error('Ha ocurrido un error al actualizar el role.');
        },
      });
  }

  private buildForm(): void {
    const nameValue = this.roleSelectedState.role()?.name;
    const descriptionValue = this.roleSelectedState.role()?.description;

    this.formState.form = this.formBuilder.group({
      name: [nameValue, RoleFieldsValidators.name],
      description: [descriptionValue, RoleFieldsValidators.description],
    });
  }
}
