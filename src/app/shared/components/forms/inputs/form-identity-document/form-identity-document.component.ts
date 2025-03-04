import { Component, computed, forwardRef, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormState } from '../../../../../core/forms/models/form-state.model';
import { CountryLocaleService } from '../../../../../core/i18n/services/country-locale.service';
import { IdentityDocumentUtils } from '../../../../../core/modules/users/identity-document/identity-document-display.const';
import { IdentityDocumentType } from '../../../../../core/modules/users/identity-document/identity-document-type.enum';
import { SelectOnFocusDirective } from '../../../../directives/select-on-focus.directive';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormInputType } from '../form-input/types/form-input.type';
import { FormIdentityDocumentField } from './models/form-identity-document-field.interface';

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

  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly readonly = input(false);
  readonly showIcons = input(false);
  readonly placeholder = input('');

  readonly value = signal<FormIdentityDocumentField>({
    number: '',
    countryCode: '',
    type: IdentityDocumentType.NationalId,
  });
  readonly isDisabled = signal(false);

  readonly identityDocumentUtils = IdentityDocumentUtils;
  readonly formInputTypes = FormInputType;

  /** Get countries. */
  readonly countries = this.countryLocaleService.value;

  private readonly searchText = signal('');

  /** Get filtered countries. */
  readonly filteredCountries = computed(() => {
    const filter = this.searchText().toLowerCase();

    return filter
      ? this.countries().filter(
          (country) => country.name.toLowerCase().includes(filter) || country.code.toLowerCase().includes(filter),
        )
      : this.countries();
  });

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
    const selectedDoc = this.identityDocumentUtils.getOptions().find((x) => x.value === this.value().type);

    return selectedDoc ? `Número de ${selectedDoc.code}` : 'Número de Documento';
  }

  writeValue(value: FormIdentityDocumentField): void {
    if (value) {
      this.value.set(value ?? { number: '', countryCode: '', type: IdentityDocumentType.NationalId });
    }
  }

  registerOnChange(fn: (value: FormIdentityDocumentField) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onChangeValue(value: FormIdentityDocumentField): void {
    this.onChange(value);
    this.onTouch();
  }
}
