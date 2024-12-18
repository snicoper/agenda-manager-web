import { LocalesSupported } from '../models/locales-supported';

export abstract class LocalizationUtils {
  static readonly defaultLocale = Intl.DateTimeFormat().resolvedOptions().locale as LocalesSupported;
  static readonly defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
}
