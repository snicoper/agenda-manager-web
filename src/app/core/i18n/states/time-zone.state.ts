import { inject, Injectable } from '@angular/core';
import { BrowserStorageService } from '../../services/browser-storage.service';
import { BaseState } from '../../states/base.state';
import { BrowserStorageKey } from '../../types/browser-storage-key.enum';
import { LocalizationUtils } from '../utils/localization.utils';

@Injectable({ providedIn: 'root' })
export class TimeZoneState extends BaseState<string> {
  private readonly browserStorage = inject(BrowserStorageService);

  override refresh(): void {
    const storedTimeZone = this.getStoredTimeZone();
    const timeZone = storedTimeZone ?? LocalizationUtils.defaultTimezone;

    this.set(timeZone);
  }

  override set(timezone: string): void {
    super.set(timezone);
    this.saveTimeZoneToStorage(timezone);
  }

  private getStoredTimeZone(): string | null {
    return this.browserStorage.get(BrowserStorageKey.TimeZone);
  }

  private saveTimeZoneToStorage(timezone: string): void {
    this.browserStorage.set(BrowserStorageKey.TimeZone, timezone);
  }
}
