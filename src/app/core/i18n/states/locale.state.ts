import { Injectable, inject } from '@angular/core';
import { DateTime, Settings } from 'luxon';
import { BrowserStorageService } from '../../services/browser-storage.service';
import { BaseState } from '../../states/base.state';
import { BrowserStorageKey } from '../../types/browser-storage-key.enum';
import { LocalesSupported } from '../models/locales-supported';

@Injectable({ providedIn: 'root' })
export class LocaleState extends BaseState<LocalesSupported> {
  private readonly browserStorage = inject(BrowserStorageService);

  override refresh(): void {
    const storedLocale = this.browserStorage.get(BrowserStorageKey.Locale) as LocalesSupported;
    const defaultLocale = DateTime.now().resolvedLocaleOptions().locale;

    this.set(storedLocale ?? defaultLocale);
    Settings.defaultLocale = this.get()!;
  }

  override set(locale: LocalesSupported): void {
    super.set(locale);
    Settings.defaultLocale = locale;
  }

  mapLocaleToLibraryFormat(locale: LocalesSupported): string {
    const localeMap: Record<LocalesSupported, string> = {
      [LocalesSupported.es]: 'es',
      [LocalesSupported.esES]: 'es',
      [LocalesSupported.en]: 'en',
      [LocalesSupported.enUS]: 'en',
    };

    return localeMap[locale];
  }
}
