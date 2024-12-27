import { Injectable, computed, inject, signal } from '@angular/core';
import { BrowserStorageKey } from '../../../../core/enums/browser-storage-key.enum';
import { ThemeColor } from '../../../../core/enums/theme-color.enum';
import { logError } from '../../../../core/errors/logger/logger.co';
import { BrowserStorageService } from '../../../../core/services/browser-storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeStateService {
  private readonly browserStorage = inject(BrowserStorageService);

  private readonly state$ = signal<ThemeColor>(ThemeColor.Auto);

  readonly value = computed(() => this.state$());

  refresh(): void {
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

  get(): ThemeColor {
    return this.value();
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
        logError('ThemeStateService.updateTheme', `ThemeColor (${theme}) not implemented.`);

        return;
    }
  }

  private applyTheme(addTheme: string, removeTheme: string): void {
    document.body.classList.remove(removeTheme);
    document.body.classList.add(addTheme);
  }
}
