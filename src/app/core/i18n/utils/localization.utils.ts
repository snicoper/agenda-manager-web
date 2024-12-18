import { AppEnvironment } from '../../config/app-environment';
import { LocalesSupported } from '../models/locales-supported';

export abstract class LocalizationUtils {
  static readonly defaultLocale = this.getDefaultLocale();
  static readonly defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  private static getDefaultLocale(): LocalesSupported {
    const browserLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    const supported = this.fromString(browserLocale);

    return supported ?? AppEnvironment.DefaultLocale;
  }

  static mapLocaleToLibraryFormat(locale: LocalesSupported): string {
    const localeMap: Record<LocalesSupported, string> = {
      [LocalesSupported.es]: 'es',
      [LocalesSupported.esES]: 'es',
      [LocalesSupported.en]: 'en',
      [LocalesSupported.enUS]: 'en',
    } as const;

    return localeMap[locale];
  }

  static fromString(value: string | null): LocalesSupported | null {
    if (!value) {
      return null;
    }

    const normalizedValue = value.trim().toLowerCase();

    return Object.values(LocalesSupported).find((locale) => locale.toLowerCase() === normalizedValue) || null;
  }

  static toString(locale: LocalesSupported): string {
    return locale.toString();
  }

  // Método útil para verificar si un locale es soportado.
  static isSupported(locale: string): boolean {
    return this.fromString(locale) !== null;
  }
}
