import { computed, effect, inject, Injectable } from '@angular/core';
import { Settings } from 'luxon';
import { LocalesSupported } from '../enums/locales-supported.enum';
import { LocalizationUtils } from '../utils/localization.utils';
import { LocaleStateService } from './locale.state.service';
import { TimeZoneStateService } from './time-zone.state.service';
import { AppEnvironment } from '../../config/app-environment';
import { logWarning, logInfo } from '../../errors/logger/logger';

/** State for the current locale in Luxon. */
@Injectable({ providedIn: 'root' })
export class LuxonDateTimeService {
  private readonly localeStateService = inject(LocaleStateService);
  private readonly timeZoneStateService = inject(TimeZoneStateService);

  private readonly value = {
    locale: computed(() => this.localeStateService.value()),
    timeZone: computed(() => this.timeZoneStateService.value()),
  };

  initialize(): void {
    effect(() => {
      const currentLocale = this.value.locale();
      const currentTimeZone = this.value.timeZone();

      if (currentLocale && currentTimeZone) {
        this.updateLuxonSettings(currentLocale, currentTimeZone);
      }
    });
  }

  private updateLuxonSettings(locale: LocalesSupported, timeZone: string): void {
    const localeValue = LocalizationUtils.toString(locale) ?? AppEnvironment.DefaultLocale;

    if (localeValue !== locale.toString()) {
      logWarning('LuxonDateTimeService.updateLuxonSettings', `Locale ${locale} not supported. Using default locale.`);
    }

    Settings.defaultLocale = localeValue;
    Settings.defaultZone = timeZone;
    logInfo(
      'LuxonDateTimeService.updateLuxonSettings',
      `Settings updated - Locale: ${localeValue}, TimeZone: ${timeZone}`,
    );
  }
}
