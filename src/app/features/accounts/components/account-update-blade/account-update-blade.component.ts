import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize, take } from 'rxjs';
import { logError, logInfo } from '../../../../core/errors/debug-logger';
import { FormState } from '../../../../core/models/form-state';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormAddressComponent } from '../../../../shared/components/forms/inputs/form-address/form-address.component';
import { FormAddressField } from '../../../../shared/components/forms/inputs/form-address/models/form-address-field.interface';
import { FormIdentityDocumentComponent } from '../../../../shared/components/forms/inputs/form-identity-document/form-identity-document.component';
import { FormIdentityDocumentField } from '../../../../shared/components/forms/inputs/form-identity-document/models/form-identity-document-field.interface';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/models/form-input.type';
import { FormPhoneNumberComponent } from '../../../../shared/components/forms/inputs/form-phone-number/form-phone-number.component';
import { FormPhoneNumberField } from '../../../../shared/components/forms/inputs/form-phone-number/models/form-phone-number-field.interface';
import { customAddressCompleteValidator } from '../../../../shared/components/forms/validators/address-complete.validator';
import { customPhoneCompleteValidator } from '../../../../shared/components/forms/validators/phone-complete.validator';
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

    const request = this.formState.form.value as AccountUpdateRequest;
    this.update(request);
  }

  private loadAccount(): void {
    this.formState.isLoading = false;

    this.buildForm();
  }

  private buildForm(): void {
    logInfo('AccountUpdateBladeComponent', this.accountState.account());
    const firstNameValue: string = this.accountState.account()?.firstName as string;
    const lastNameValue: string = this.accountState.account()?.lastName as string;
    const phoneNumberValue: FormPhoneNumberField = this.accountState.account()?.phoneNumber as FormPhoneNumberField;
    const addressValue: FormAddressField = this.accountState.account()?.address as FormAddressField;
    const identityDocumentValue: FormIdentityDocumentField = this.accountState.account()
      ?.identityDocument as FormIdentityDocumentField;

    // TODO: Crear validación para identityDocument.
    this.formState.form = this.formBuilder.group({
      firstName: [firstNameValue, [Validators.required, Validators.maxLength(100)]],
      lastName: [lastNameValue, [Validators.required, Validators.maxLength(100)]],
      phone: [phoneNumberValue, [Validators.required, customPhoneCompleteValidator()]],
      address: [addressValue, [Validators.required, customAddressCompleteValidator()]],
      identityDocument: [identityDocumentValue, [Validators.required]],
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
        error: (error) => {
          logError(error);
          this.formState.badRequest = error;
        },
      });
  }
}
