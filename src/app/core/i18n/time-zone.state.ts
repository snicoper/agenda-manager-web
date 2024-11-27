import { Injectable } from '@angular/core';
import { Settings } from 'luxon';
import { BaseState } from '../states/base.state';
import { LocalizationUtils } from './localization-utils';

@Injectable({ providedIn: 'root' })
export class TimeZoneState extends BaseState<string> {
  override refresh(): void {
    this.set(LocalizationUtils.defaultTimezone);
    Settings.defaultZone = this.get()!;
  }

  override set(timezone: string): void {
    super.set(timezone);
    Settings.defaultZone = timezone;
  }
}
