import { Injectable, computed, effect, inject, signal } from '@angular/core';
import countries from 'i18n-iso-countries';
import * as en from 'i18n-iso-countries/langs/en.json';
import * as es from 'i18n-iso-countries/langs/es.json';
import { CountryLocale } from '../models/country-locale.interface';
import { LocaleState } from '../states/locale.state';
import { LocalizationUtils } from '../utils/localization.utils';

/** Countries from library i18n-iso-countries. */
@Injectable({ providedIn: 'root' })
export class CountryLocaleService {
  private readonly localeState = inject(LocaleState);

  private countriesState = signal<CountryLocale[]>([]);

  readonly countries = computed(() => this.countriesState());

  constructor() {
    countries.registerLocale(es);
    countries.registerLocale(en);

    // Update countries list whenever the locale changes.
    effect(() => {
      const locale = this.localeState.value();

      if (locale) {
        this.updateCountriesList(LocalizationUtils.mapLocaleToLibraryFormat(locale));
      }
    });
  }

  private updateCountriesList(locale: string): void {
    const countriesObj = countries.getNames(locale);
    const sortedCountries = Object.entries(countriesObj)
      .map(([code, name]) => ({
        code,
        name: name as string,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, locale));

    this.countriesState.set(sortedCountries);
  }
}
