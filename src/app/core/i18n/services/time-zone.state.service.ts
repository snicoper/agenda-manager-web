import { computed, inject, Injectable, signal } from '@angular/core';
import { LocalizationUtils } from '../utils/localization.utils';
import { BrowserStorageKey } from '../../enums/browser-storage-key.enum';
import { BrowserStorageService } from '../../services/browser-storage.service';

@Injectable({ providedIn: 'root' })
export class TimeZoneStateService {
  private readonly browserStorage = inject(BrowserStorageService);

  private readonly state$ = signal('');

  readonly value = computed(() => this.state$());

  initialize(): void {
    const storedTimeZone = this.getStoredTimeZone();
    const timeZone = storedTimeZone ?? LocalizationUtils.defaultTimezone;

    this.set(timeZone);
  }

  set(timezone: string): void {
    this.state$.set(timezone);
    this.saveTimeZoneToStorage(timezone);
  }

  get(): string {
    return this.state$();
  }

  private getStoredTimeZone(): string | null {
    return this.browserStorage.get(BrowserStorageKey.TimeZone);
  }

  private saveTimeZoneToStorage(timezone: string): void {
    this.browserStorage.set(BrowserStorageKey.TimeZone, timezone);
  }
}
