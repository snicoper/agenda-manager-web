import { Component, computed, forwardRef, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormState } from '../../../../../core/forms/interfaces/form-state.interface';
import { CountryLocaleService } from '../../../../../core/i18n/services/country-locale.service';
import { SelectOnFocusDirective } from '../../../../directives/select-on-focus.directive';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormInputType } from '../form-input/types/form-input.type';
import { FormIdentityDocumentField } from './interfaces/form-identity-document-field.interface';
import { IdentityDocumentUtils } from '../../../../../core/modules/users/identity-document/identity-document-display.const';
import { IdentityDocumentType } from '../../../../../core/modules/users/identity-document/identity-document-type.enum';

/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-identity-document',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    FieldErrorComponent,
    SelectOnFocusDirective,
  ],
  templateUrl: './form-identity-document.component.html',
  styleUrl: './form-identity-document.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormIdentityDocumentComponent),
      multi: true,
    },
  ],
})
export class FormIdentityDocumentComponent implements ControlValueAccessor {
  private readonly countryLocaleService = inject(CountryLocaleService);

  private searchText = signal('');

  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();
  readonly = input(false);
  showIcons = input(false);
  placeholder = input('');

  readonly identityDocumentUtils = IdentityDocumentUtils;
  readonly formInputTypes = FormInputType;

  /** Get countries. */
  readonly countries = this.countryLocaleService.value;

  /** Get filtered countries. */
  readonly filteredCountries = computed(() => {
    const filter = this.searchText().toLowerCase();

    return filter
      ? this.countries().filter(
          (country) => country.name.toLowerCase().includes(filter) || country.code.toLowerCase().includes(filter),
        )
      : this.countries();
  });

  value: FormIdentityDocumentField = {
    number: '',
    countryCode: '',
    type: IdentityDocumentType.NationalId,
  };
  isDisabled = false;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `identity-document-${(FormIdentityDocumentComponent.nextId += 1)}`;

  onChange = (_: FormIdentityDocumentField): void => {};
  onTouch = (): void => {};

  handleCountryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
  }

  displayCountry = (code: string): string => {
    if (!code) {
      return '';
    }

    const country = this.countries().find((c) => c.code === code);

    return country ? country.name : code;
  };

  getDocumentLabel(): string {
    const selectedDoc = this.identityDocumentUtils.getOptions().find((x) => x.value === this.value.type);

    return selectedDoc ? `Número de ${selectedDoc.code}` : 'Número de Documento';
  }

  writeValue(value: FormIdentityDocumentField): void {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: (value: FormIdentityDocumentField) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: FormIdentityDocumentField): void {
    this.onChange(value);
    this.onTouch();
  }
}
