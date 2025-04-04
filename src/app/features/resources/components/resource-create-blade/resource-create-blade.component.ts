import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { FormState } from '../../../../core/forms/models/form-state.model';
import { HttpErrorResponseMappingUtils } from '../../../../core/http/utils/http-error-response-mapping.utils';
import { ResourceCategory } from '../../../../core/modules/resource-management/resource-category/resource-category.enum';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { CommonUtils } from '../../../../core/utils/common/common.utils';
import { UrlUtils } from '../../../../core/utils/url/url.utils';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormColorPickerComponent } from '../../../../shared/components/forms/inputs/form-color-picker/form-color-picker.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { FormTextareaComponent } from '../../../../shared/components/forms/inputs/form-textarea/form-textarea.component';
import { FormResourceTypeSelectorComponent } from '../../../../shared/components/forms/inputs/selectors/form-resource-type-selector/form-resource-type-selector.component';
import { SelectableResourceType } from '../../../../shared/components/forms/inputs/selectors/form-resource-type-selector/models/selectable-resource-type.model';
import { AccountSelectorComponent } from '../../../../shared/components/selectors/account-selector/account-selector.component';
import { AccountSelectorResponse } from '../../../../shared/components/selectors/account-selector/models/responses/account-selecter.response';
import { ResourceFieldsValidators } from '../../contracts/resource-fields-validator.contract';
import { ResourceCreateRequest } from '../../models/requests/resource-create.request';
import { ResourceApiService } from '../../services/api/resource-api.service';

@Component({
  selector: 'am-resource-create-blade',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    FormInputComponent,
    FormTextareaComponent,
    FormColorPickerComponent,
    FormResourceTypeSelectorComponent,
    NonFieldErrorsComponent,
    AccountSelectorComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './resource-create-blade.component.html',
  styleUrl: './resource-create-blade.component.scss',
})
export class ResourceCreateBladeComponent implements OnInit {
  private readonly apiService = inject(ResourceApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly bladeService = inject(BladeService);

  readonly isStaff = signal(false);

  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };
  readonly formInputTypes = FormInputType;

  ngOnInit(): void {
    this.buildForm();
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
    this.create(request);
  }

  handleResourceTypeChange(resourceTypeSelected: SelectableResourceType): void {
    if (resourceTypeSelected.category === ResourceCategory.Staff) {
      this.isStaff.set(true);
    } else {
      this.isStaff.set(false);
      this.formState.form.get('userId')?.patchValue(null);
    }
  }

  handleUserSelected(account: AccountSelectorResponse): void {
    this.formState.form.get('userId')?.patchValue(account.accountId);
  }

  private mapToRequest(): ResourceCreateRequest {
    const request: ResourceCreateRequest = {
      resourceTypeId: this.formState.form.value.resourceType.resourceTypeId,
      userId: this.formState.form.value.userId,
      name: this.formState.form.value.name,
      description: this.formState.form.value.description,
      textColor: this.formState.form.value.textColor,
      backgroundColor: this.formState.form.value.backgroundColor,
    };

    return request;
  }

  private buildForm(): void {
    this.formState.form = this.formBuilder.group({
      resourceType: [null, ResourceFieldsValidators.resourceType],
      userId: [null, ResourceFieldsValidators.userId],
      name: ['', ResourceFieldsValidators.name],
      description: ['', ResourceFieldsValidators.description],
      textColor: [CommonUtils.getRandomColorHexadecimal(), ResourceFieldsValidators.textColor],
      backgroundColor: [CommonUtils.getRandomColorHexadecimal(), ResourceFieldsValidators.backgroundColor],
    });
  }

  private create(request: ResourceCreateRequest): void {
    this.formState.isLoading = true;

    this.apiService
      .createResource(request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: (response) => {
          this.snackBarService.success('Recurso creado correctamente');
          this.bladeService.emitResult(true);

          const url = UrlUtils.buildSiteUrl(SiteUrls.resources.details, { id: response.resourceId });
          this.router.navigateByUrl(url);
        },
        error: (error: HttpErrorResponse) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }
}
