import { Injectable, inject } from '@angular/core';
import { BrowserStorageKey } from '../../../../enums/browser-storage-key.enum';
import { BrowserStorageService } from '../../../../services/browser-storage.service';
import { BaseState } from '../../../../services/states/base.state';
import { LocalesSupported } from '../../enums/locales-supported.enum';
import { LocalizationUtils } from '../../utils/localization.utils';

/** State for the current locale. */
@Injectable({ providedIn: 'root' })
export class LocaleState extends BaseState<LocalesSupported> {
  private readonly browserStorage = inject(BrowserStorageService);

  override refresh(): void {
    const storedLocale = LocalizationUtils.fromString(this.browserStorage.get(BrowserStorageKey.Locale));
    const localeSupported = storedLocale ?? LocalizationUtils.defaultLocale;

    this.set(localeSupported);
  }

  override set(locale: LocalesSupported): void {
    super.set(locale);
    this.saveLocaleToStorage(locale);
  }

  private saveLocaleToStorage(locale: LocalesSupported): void {
    this.browserStorage.set(BrowserStorageKey.Locale, locale);
  }
}
