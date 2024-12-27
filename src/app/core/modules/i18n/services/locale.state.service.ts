import { Injectable, computed, inject, signal } from '@angular/core';
import { BrowserStorageKey } from '../../../enums/browser-storage-key.enum';
import { BrowserStorageService } from '../../../services/browser-storage.service';
import { LocalesSupported } from '../enums/locales-supported.enum';
import { LocalizationUtils } from '../utils/localization.utils';

/** State for the current locale. */
@Injectable({ providedIn: 'root' })
export class LocaleStateService {
  private readonly browserStorage = inject(BrowserStorageService);

  private readonly state$ = signal<LocalesSupported>(LocalizationUtils.defaultLocale);

  readonly value = computed(() => this.state$());

  refresh(): void {
    const storedLocale = LocalizationUtils.fromString(this.browserStorage.get(BrowserStorageKey.Locale));
    const localeSupported = storedLocale ?? LocalizationUtils.defaultLocale;

    this.set(localeSupported);
  }

  set(locale: LocalesSupported): void {
    this.saveLocaleToStorage(locale);
  }

  get(): LocalesSupported {
    return this.state$();
  }

  private saveLocaleToStorage(locale: LocalesSupported): void {
    this.browserStorage.set(BrowserStorageKey.Locale, locale);
  }
}
