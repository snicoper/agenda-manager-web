import { Injectable, inject, signal } from '@angular/core';
import { DateTime, Settings } from 'luxon';
import { BrowserStorageService } from '../services/browser-storage.service';
import { BrowserStorageKey } from '../types/browser-storage-key.enum';
import { LocalesSupported } from './locales-supported';
import { LocalizationUtils } from './localization-utils';

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  private readonly browserStorageService = inject(BrowserStorageService);

  private readonly locale$ = signal(LocalizationUtils.defaultLocale);
  private readonly timezone$ = signal(LocalizationUtils.defaultTimezone);

  initialize(locale?: LocalesSupported): void {
    // Precedencia: localStorage -> parámetro -> defaultLocale.
    locale =
      (this.browserStorageService.get(BrowserStorageKey.Locale) as LocalesSupported) ??
      locale ??
      DateTime.now().resolvedLocaleOptions().locale;

    // La inicialización no contiene los datos de locales supported en el Service por lo que
    // no comprobará la validación.
    this.setLocale(locale);
  }

  /** Obtener locale del usuario actual. */
  getLocaleValue(): LocalesSupported {
    return this.locale$();
  }

  /** Obtener timezone del usuario actual. */
  getTimezoneValue(): string {
    return this.timezone$();
  }

  /** Establecer locale del usuario actual. */
  setLocale(locale: LocalesSupported): void {
    this.locale$.set(locale);
    Settings.defaultLocale = this.locale$();
  }

  /** Establecer timezone del usuario actual. */
  setTimezone(timezone: string): void {
    this.timezone$.set(timezone);
    Settings.defaultZone = timezone;
  }
}
