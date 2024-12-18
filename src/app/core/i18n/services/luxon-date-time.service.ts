import { computed, effect, inject, Injectable } from '@angular/core';
import { Settings } from 'luxon';
import { AppEnvironment } from '../../config/app-environment';
import { logInfo, logWarning } from '../../errors/debug-logger';
import { BaseState } from '../../states/base.state';
import { LocalesSupported } from '../models/locales-supported';
import { LocaleState } from '../states/locale.state';
import { TimeZoneState } from '../states/time-zone.state';
import { LocalizationUtils } from '../utils/localization.utils';

/** State for the current locale in Luxon. */
@Injectable({ providedIn: 'root' })
export class LuxonDateTimeService extends BaseState<string> {
  private readonly localeState = inject(LocaleState);
  private readonly timeZoneState = inject(TimeZoneState);

  private readonly locale = computed(() => this.localeState.value());
  private readonly timeZone = computed(() => this.timeZoneState.value());

  override refresh(): void {
    effect(() => {
      const currentLocale = this.locale();
      const currentTimeZone = this.timeZone();

      if (currentLocale && currentTimeZone) {
        this.updateLuxonSettings(currentLocale, currentTimeZone);
      }
    });
  }

  private updateLuxonSettings(locale: LocalesSupported, timeZone: string): void {
    const value = LocalizationUtils.toString(locale) ?? AppEnvironment.DefaultLocale;

    if (value !== locale.toString()) {
      logWarning('LuxonDateTimeService', `Locale ${locale} not supported. Using default locale.`);
    }

    this.set(value);
    Settings.defaultLocale = value;
    Settings.defaultZone = timeZone;
    logInfo('LuxonDateTimeService', `Settings updated - Locale: ${value}, TimeZone: ${timeZone}`);
  }
}
