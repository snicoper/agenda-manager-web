import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormState } from '../../../../core/forms/models/form-state.model';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormColorPickerComponent } from '../../../../shared/components/forms/inputs/form-color-picker/form-color-picker.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { FormTextareaComponent } from '../../../../shared/components/forms/inputs/form-textarea/form-textarea.component';
import { ResourceFieldsValidators } from '../../contracts/resource-fields-validator.contract';
import { ResourceUpdateRequest } from '../../models/requests/resource-update.request';
import { ResourceApiService } from '../../services/api/resource-api.service';
import { ResourceSelectedStateService } from '../../services/state/resource-selected-state.service';

@Component({
  selector: 'am-resource-update-blade',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormInputComponent,
    FormTextareaComponent,
    FormColorPickerComponent,
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './resource-update-blade.component.html',
  styleUrl: './resource-update-blade.component.scss',
})
export class ResourceUpdateBladeComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(ResourceApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly bladeService = inject(BladeService);
  private readonly resourceSelectedStateService = inject(ResourceSelectedStateService);

  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };
  readonly formInputTypes = FormInputType;
  readonly resourceState = this.resourceSelectedStateService.state;

  ngOnInit(): void {
    setTimeout(() => {
      // Force an extra change detection cycle for Material initialization.
      // @see BladeComponent for more information.
    }, 0);

    // Continue with normal initialization.
    this.loadResource();
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

  private mapToRequest(): ResourceUpdateRequest {
    const formValue = this.formState.form.value;

    return {
      name: formValue.name,
      description: formValue.description,
      textColor: formValue.textColor,
      backgroundColor: formValue.backgroundColor,
    };
  }

  private loadResource(): void {
    this.resourceSelectedStateService.refresh();
    this.buildForm();
  }

  private buildForm(): void {
    const resource = this.resourceState.resource();
    this.formState.form = this.formBuilder.group({
      name: [resource?.name, ResourceFieldsValidators.name],
      description: [resource?.description, ResourceFieldsValidators.description],
      textColor: [resource?.textColor, ResourceFieldsValidators.textColor],
      backgroundColor: [resource?.backgroundColor, ResourceFieldsValidators.backgroundColor],
    });
  }

  private update(request: ResourceUpdateRequest): void {
    this.formState.isLoading = true;

    this.apiService.updateResource(this.resourceState.resourceId()!, request).subscribe({
      next: () => {
        this.snackBarService.success('Recurso actualizado correctamente');
        this.bladeService.emitResult(true);
      },
      error: (error) => {
        this.formState.badRequest = error.error;
        this.formState.isLoading = false;
      },
    });
  }
}
