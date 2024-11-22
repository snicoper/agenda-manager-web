import { Injectable, computed, inject, signal } from '@angular/core';
import { logError } from '../errors/log-messages';
import { BrowserStorageKey } from '../types/browser-storage-key.enum';
import { ThemeColor } from '../types/theme-color.enum';
import { BrowserStorageService } from './browser-storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeManagerService {
  private readonly browserStorageService = inject(BrowserStorageService);

  private readonly theme$ = signal(ThemeColor.Auto);

  private colorStorage = ThemeColor.Auto;

  readonly theme = computed(() => this.theme$());

  initialize(): void {
    this.colorStorage = (this.browserStorageService.get(BrowserStorageKey.Theme) as ThemeColor) || ThemeColor.Auto;

    if (this.colorStorage === ThemeColor.Auto) {
      // Set the theme based on the user's system preferences.
      this.colorStorage = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ThemeColor.Dark
        : ThemeColor.Light;
    }

    this.set(this.colorStorage);
  }

  getValue(): ThemeColor {
    return this.theme$();
  }

  toggle(): void {
    const theme = this.theme$() === ThemeColor.Dark ? ThemeColor.Light : ThemeColor.Dark;
    this.set(theme);
  }

  set(theme: ThemeColor): void {
    if (!this.colorStorage || theme !== this.theme$()) {
      this.browserStorageService.set(BrowserStorageKey.Theme, theme);
    }

    switch (theme) {
      case ThemeColor.Dark:
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        break;
      case ThemeColor.Light:
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        break;
      case ThemeColor.Auto:
        this.initialize();
        break;
      default:
        logError(`ThemeColor (${theme}) not implemented.`);
    }

    this.theme$.set(theme);
  }
}
