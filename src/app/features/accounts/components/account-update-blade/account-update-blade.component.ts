import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, take } from 'rxjs';
import { FormState } from '../../../../core/models/forms/form-state.interface';
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
import { HttpErrorResponseMappingUtils } from '../../../../shared/utils/http-error-response-mapping.utils';
import { AccountUpdateRequest } from '../../models/account-update.request';
import { AccountApiService } from '../../services/account-api.service';
import { AccountDetailsService } from '../../services/account-details.service';

/**
 * Known Issue: Material UI Initialization in Dynamic Component Loading
 *
 * When loading Material UI components dynamically (especially with nested structures
 * like blades + tabs), there can be timing issues with Material's initialization.
 *
 * The issue manifests as:
 * - Incorrect initial styling
 * - Components appearing unstyled momentarily
 * - Style flickering on first render
 *
 * Solution:
 * Adding a setTimeout in ngOnInit forces an additional change detection cycle,
 * allowing Material to complete its initialization before the component fully renders.
 */
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
  private readonly accountDetailsService = inject(AccountDetailsService);

  readonly formState: FormState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  };
  readonly formInputTypes = FormInputType;

  accountState = this.accountDetailsService.state;

  ngOnInit(): void {
    setTimeout(() => {
      // Force an extra change detection cycle for Material initialization.
    }, 0);

    // Continue with normal initialization.
    this.loadAccount();
  }

  ngOnDestroy(): void {
    this.bladeService.hide();
  }

  handleCloseBlade(): void {
    this.bladeService.emitResult(false);
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    this.formState.isLoading = true;
    const request: AccountUpdateRequest = this.formState.form.value;
    this.update(request);
  }

  private loadAccount(): void {
    this.accountDetailsService.refresh();
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
      return;
    }

    this.apiService
      .updateAccount(this.accountState.userId()!, request)
      .pipe(
        take(1),
        finalize(() => (this.formState.isLoading = false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Cuenta actualizada correctamente');
          this.accountDetailsService.load(this.accountState.userId()!);
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
