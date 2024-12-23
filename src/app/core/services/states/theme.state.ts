import { Injectable, computed, inject } from '@angular/core';
import { logError } from '../../errors/debug-logger';
import { BrowserStorageKey } from '../../types/browser-storage-key.enum';
import { ThemeColor } from '../../types/theme-color.enum';
import { BrowserStorageService } from '../browser-storage.service';
import { BaseState } from './base.state';

@Injectable({ providedIn: 'root' })
export class ThemeState extends BaseState<ThemeColor> {
  private readonly browserStorage = inject(BrowserStorageService);

  readonly theme = computed(() => this.state$());

  override refresh(): void {
    const storedTheme = this.browserStorage.get(BrowserStorageKey.Theme) as ThemeColor;
    const initialTheme = storedTheme || ThemeColor.Auto;

    if (initialTheme === ThemeColor.Auto) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ThemeColor.Dark
        : ThemeColor.Light;
      this.updateTheme(systemTheme);
    } else {
      this.updateTheme(initialTheme);
    }
  }

  toggle(): void {
    const currentTheme = this.get();
    const newTheme = currentTheme === ThemeColor.Dark ? ThemeColor.Light : ThemeColor.Dark;
    this.updateTheme(newTheme);
  }

  override set(theme: ThemeColor): void {
    this.updateTheme(theme);
  }

  private updateTheme(theme: ThemeColor): void {
    this.browserStorage.set(BrowserStorageKey.Theme, theme);

    switch (theme) {
      case ThemeColor.Dark:
        this.applyTheme('dark-theme', 'light-theme');
        break;
      case ThemeColor.Light:
        this.applyTheme('light-theme', 'dark-theme');
        break;
      case ThemeColor.Auto:
        this.refresh();
        break;
      default:
        logError(`ThemeColor (${theme}) not implemented.`);

        return;
    }

    super.set(theme);
  }

  private applyTheme(addTheme: string, removeTheme: string): void {
    document.body.classList.remove(removeTheme);
    document.body.classList.add(addTheme);
  }
}
