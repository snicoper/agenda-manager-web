import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, take } from 'rxjs';
import { FormState } from '../../../../core/forms/models/form-state.model';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { FormTextareaComponent } from '../../../../shared/components/forms/inputs/form-textarea/form-textarea.component';
import { ResourceTypeFieldsValidators } from '../../contracts/resource-type-fields-validator.contract';
import { ResourceTypeUpdateRequest } from '../../models/requests/resource-type-update.request';
import { ResourceTypeApiService } from '../../services/api/resource-type-api.service';
import { ResourceTypeSelectedStateService } from '../../services/state/resource-type-selected-state.service';

@Component({
  selector: 'am-resource-type-update-blade',
  imports: [
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    FormInputComponent,
    FormTextareaComponent,
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './resource-type-update-blade.component.html',
  styleUrl: './resource-type-update-blade.component.scss',
})
export class ResourceTypeUpdateBladeComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(ResourceTypeApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly bladeService = inject(BladeService);
  private readonly resourceTypeSelectedStateService = inject(ResourceTypeSelectedStateService);

  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };
  readonly formInputTypes = FormInputType;
  readonly resourceTypeState = this.resourceTypeSelectedStateService.state;

  ngOnInit(): void {
    setTimeout(() => {
      // Force an extra change detection cycle for Material initialization.
    }, 0);

    // Continue with normal initialization.
    this.loadResourceType();
  }

  ngOnDestroy(): void {
    this.bladeService.close();
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
    this.update(request);
  }

  private mapToRequest(): ResourceTypeUpdateRequest {
    const request: ResourceTypeUpdateRequest = {
      resourceTypeId: this.resourceTypeState.resourceTypeId()!,
      name: this.formState.form.value.name,
      description: this.formState.form.value.description,
    };

    return request;
  }

  private update(request: ResourceTypeUpdateRequest): void {
    this.formState.isLoading = true;

    this.apiService
      .updateResourceType(this.resourceTypeState.resourceTypeId()!, request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Tipo de recurso actualizado correctamente');
          this.bladeService.emitResult(true);
        },
        error: () => {
          this.snackBarService.error('Error al actualizar el tipo de recurso');
        },
      });
  }

  private loadResourceType(): void {
    this.resourceTypeSelectedStateService.refresh();
    this.buildForm();
  }

  private buildForm(): void {
    const nameValue = this.resourceTypeState.resourceType()?.name;
    const descriptionValue = this.resourceTypeState.resourceType()?.description;

    this.formState.form = this.formBuilder.group({
      name: [nameValue, ResourceTypeFieldsValidators.name],
      description: [descriptionValue, ResourceTypeFieldsValidators.description],
    });
  }
}
