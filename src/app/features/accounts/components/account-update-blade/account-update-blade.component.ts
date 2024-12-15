import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormState } from '../../../../core/models/form-state';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { BtnLoadingComponent } from '../../../../shared/components/buttons/btn-loading/btn-loading.component';
import { NonFieldErrorsComponent } from '../../../../shared/components/forms/errors/non-field-errors/non-field-errors.component';
import { FormAddressComponent } from '../../../../shared/components/forms/inputs/form-address/form-address.component';
import { FormInputComponent } from '../../../../shared/components/forms/inputs/form-input/form-input.component';
import { FormInputType } from '../../../../shared/components/forms/inputs/form-input/models/form-input.type';
import { FormPhoneNumberComponent } from '../../../../shared/components/forms/inputs/form-phone-number/form-phone-number.component';
import { CustomValidators } from '../../../../shared/components/forms/validators/custom-validators-form';
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
    NonFieldErrorsComponent,
    BtnLoadingComponent,
  ],
  templateUrl: './account-update-blade.component.html',
  styleUrl: './account-update-blade.component.scss',
})
export class AccountUpdateBladeComponent implements OnInit {
  private readonly apiService = inject(AccountApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly bladeService = inject(BladeService);
  private readonly accountDetailsService = inject(AccountDetailsService);

  readonly formState = {
    form: this.formBuilder.group({}),
    badRequest: undefined,
    isSubmitted: false,
    isLoading: false,
  } as FormState;
  readonly formInputTypes = FormInputType;

  accountState = this.accountDetailsService.state;

  ngOnInit(): void {
    setTimeout(() => {
      // Force an extra change detection cycle for Material initialization.
    }, 0);

    // Continue with normal initialization
    this.loadAccount();
  }

  handleCloseBlade(): void {
    this.bladeService.emitResult(false);
  }

  handleSubmit(): void {
    this.formState.isSubmitted = true;

    if (this.formState.form.invalid) {
      return;
    }

    // const request = this.formState.form.value as AccountUpdateRequest;
    // this.update(request);
  }

  private loadAccount(): void {
    this.formState.isLoading = false;

    this.buildForm();
  }

  private buildForm(): void {
    this.formState.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, CustomValidators.phoneComplete()]],
      address: ['', [Validators.required, CustomValidators.addressComplete()]],
    });
  }

  // private update(request: AccountUpdateRequest): void {
  //   this.buildForm();
  // }
}
