import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { LocalizationService } from '../localizations/localization.service';
import { ThemeManagerService } from '../services/theme-manager.service';

/** Configuración inicial de la aplicación. */
@Injectable({ providedIn: 'root' })
export class AppInitializer {
  private readonly authService = inject(AuthService);
  private readonly localizationService = inject(LocalizationService);
  private readonly themeManagerService = inject(ThemeManagerService);

  load(): Promise<void> {
    return new Promise((resolve) => {
      this.localizationService.initialize();
      this.authService.initialize();
      this.themeManagerService.initialize();
      resolve();
    });
  }
}
