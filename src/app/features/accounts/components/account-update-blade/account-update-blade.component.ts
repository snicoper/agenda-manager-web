import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, take } from 'rxjs';
import { logError } from '../../../../core/errors/logger/logger';
import { FormState } from '../../../../core/forms/models/form-state.model';
import { HttpErrorResponseMappingUtils } from '../../../../core/http/utils/http-error-response-mapping.utils';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormAddressComponent } from '../../../../shared/components/forms/inputs/form-address/form-address.component';
import { FormAddressField } from '../../../../shared/components/forms/inputs/form-address/models/form-address-field.interface';
import { FormIdentityDocumentComponent } from '../../../../shared/components/forms/inputs/form-identity-document/form-identity-document.component';
import { FormIdentityDocumentField } from '../../../../shared/components/forms/inputs/form-identity-document/models/form-identity-document-field.interface';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/types/form-input.type';
import { FormPhoneNumberComponent } from '../../../../shared/components/forms/inputs/form-phone-number/form-phone-number.component';
import { FormPhoneNumberField } from '../../../../shared/components/forms/inputs/form-phone-number/models/form-phone-number-field.interface';
import { addressCompleteValidator } from '../../../../shared/components/forms/validators/address-complete.validator';
import { identityDocumentValidator } from '../../../../shared/components/forms/validators/identity-document.validator';
import { phoneCompleteValidator } from '../../../../shared/components/forms/validators/phone-complete.validator';
import { AccountUpdateRequest } from '../../models/requests/account-update.request';
import { AccountApiService } from '../../services/api/account-api.service';
import { AccountSelectedStateService } from '../../services/state/account-selected-state.service';

@Component({
  selector: 'am-account-update-blade',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormInputComponent,
    FormPhoneNumberComponent,
    FormAddressComponent,
    FormIdentityDocumentComponent,
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './account-update-blade.component.html',
  styleUrl: './account-update-blade.component.scss',
})
export class AccountUpdateBladeComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly bladeService = inject(BladeService);
  private readonly accountSelectedStateService = inject(AccountSelectedStateService);

  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };
  readonly formInputTypes = FormInputType;
  readonly accountState = this.accountSelectedStateService.state;

  ngOnInit(): void {
    setTimeout(() => {
      // Force an extra change detection cycle for Material initialization.
      // @see BladeComponent for more information.
    }, 0);

    // Continue with normal initialization.
    this.loadAccount();
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

  private mapToRequest(): AccountUpdateRequest {
    const request: AccountUpdateRequest = {
      email: this.accountState.account()!.email,
      firstName: this.formState.form.value.firstName,
      lastName: this.formState.form.value.lastName,
      phone: this.formState.form.value.phone,
      address: this.formState.form.value.address,
      identityDocument: this.formState.form.value.identityDocument,
    };

    return request;
  }

  private loadAccount(): void {
    this.accountSelectedStateService.refresh();
    this.buildForm();
  }

  private buildForm(): void {
    this.formState.form = this.formBuilder.group({
      firstName: [this.getNameValue('firstName'), [Validators.required, Validators.maxLength(100)]],
      lastName: [this.getNameValue('lastName'), [Validators.required, Validators.maxLength(100)]],
      phone: [this.getPhoneNumberValue(), [phoneCompleteValidator()]],
      address: [this.getAddressValue(), [addressCompleteValidator()]],
      identityDocument: [this.getIdentityDocumentValue(), [identityDocumentValidator()]],
    });
  }

  private update(request: AccountUpdateRequest): void {
    if (!this.accountState.userId()) {
      logError('AccountUpdateBladeComponent.update', 'User ID is not set.');

      return;
    }

    this.formState.isLoading = true;

    this.apiService
      .updateAccount(this.accountState.userId()!, request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Cuenta actualizada correctamente');
          this.accountSelectedStateService.refresh();
          this.bladeService.emitResult(true);
        },
        error: (error: HttpErrorResponse) => {
          const badRequest = HttpErrorResponseMappingUtils.mapToBadRequest(error);
          this.formState.badRequest = badRequest;
        },
      });
  }

  private getNameValue(field: keyof Pick<AccountUpdateRequest, 'firstName' | 'lastName'>): string {
    return (this.accountState.account()?.[field] as string) ?? '';
  }

  private getPhoneNumberValue(): FormPhoneNumberField {
    const defaultPhoneNumber: FormPhoneNumberField = {
      countryCode: '',
      number: '',
    };

    const phoneNumberValue: FormPhoneNumberField =
      (this.accountState.account()?.phoneNumber as FormPhoneNumberField) ?? defaultPhoneNumber;

    return phoneNumberValue;
  }

  private getAddressValue(): FormAddressField {
    const defaultAddress: FormAddressField = {
      street: '',
      city: '',
      country: '',
      state: '',
      postalCode: '',
    };

    const addressValue: FormAddressField = (this.accountState.account()?.address as FormAddressField) ?? defaultAddress;

    return addressValue;
  }

  private getIdentityDocumentValue(): FormIdentityDocumentField {
    const defaultIdentityDocument: FormIdentityDocumentField = {
      number: '',
      countryCode: '',
      type: null,
    };

    const identityDocumentValue: FormIdentityDocumentField =
      (this.accountState.account()?.identityDocument as FormIdentityDocumentField) ?? defaultIdentityDocument;

    return identityDocumentValue;
  }
}
