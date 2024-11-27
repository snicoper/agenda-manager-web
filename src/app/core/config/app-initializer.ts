import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { LocaleState } from '../i18n/locale.state';
import { ThemeState } from '../states/theme.state';

/** Configuración inicial de la aplicación. */
@Injectable({ providedIn: 'root' })
export class AppInitializer {
  private readonly authService = inject(AuthService);
  private readonly localeState = inject(LocaleState);
  private readonly timeZoneState = inject(LocaleState);
  private readonly themeState = inject(ThemeState);

  load(): Promise<void> {
    return new Promise((resolve) => {
      this.localeState.refresh();
      this.timeZoneState.refresh();
      this.authService.initialize();
      this.themeState.refresh();
      resolve();
    });
  }
}
