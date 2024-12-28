import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { FormState } from '../../../../core/forms/interfaces/form-state.interface';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { FormTextareaComponent } from '../../../../shared/components/forms/inputs/form-textarea/form-textarea.component';
import { HttpErrorResponseMappingUtils } from '../../../../shared/utils/http/http-error-response-mapping.utils';
import { ResourceTypeCreateRequest } from '../../interfaces/requests/resource-type-create.request';
import { ResourceTypeApiService } from '../../services/api/resource-type-api.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';

@Component({
  selector: 'am-resource-type-create-blade',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    NonFieldErrorsComponent,
    FormInputComponent,
    FormTextareaComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './resource-type-create-blade.component.html',
  styleUrl: './resource-type-create-blade.component.scss',
})
export class ResourceTypeCreateBladeComponent implements OnInit {
  private readonly apiService = inject(ResourceTypeApiService);
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
    setTimeout(() => {
      // Force an extra change detection cycle for Material initialization.
      // @see BladeComponent for more information.
    }, 0);

    // Continue with normal initialization.
    this.buildForm();
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    const request: ResourceTypeCreateRequest = this.formState.form.value;
    this.create(request);
  }

  handleCloseBlade(): void {
    this.bladeService.emitResult(false);
  }

  private buildForm(): void {
    this.formState.form = this.formBuilder.group({
      name: [null],
      description: [null],
    });
  }

  private create(request: ResourceTypeCreateRequest): void {
    this.formState.isLoading = true;
    this.apiService
      .createResourceType(request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: (response) => {
          this.snackBarService.success('Tipo de recurso creado con éxito.');
          this.bladeService.emitResult(true);
          // TODO: Navigate to the resource type details.
        },
        error: (error) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }
}
