import { Injectable, computed, effect, inject, signal } from '@angular/core';
import countries from 'i18n-iso-countries';
import * as en from 'i18n-iso-countries/langs/en.json';
import * as es from 'i18n-iso-countries/langs/es.json';
import { CountryLocale } from '../models/country-locale.model';
import { LocalizationUtils } from '../utils/localization.utils';
import { LocaleStateService } from './locale.state.service';

/** Countries from library i18n-iso-countries. */
@Injectable({ providedIn: 'root' })
export class CountryLocaleService {
  private readonly localeStateService = inject(LocaleStateService);

  private readonly state$ = signal<CountryLocale[]>([]);

  readonly value = computed(() => this.state$());

  constructor() {
    countries.registerLocale(es);
    countries.registerLocale(en);

    // Update countries list whenever the locale changes.
    effect(() => {
      const locale = this.localeStateService.value();

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

    this.state$.set(sortedCountries);
  }
}
