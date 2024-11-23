import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { ThemeManagerService } from '../services/theme-manager.service';

/** Configuración inicial de la aplicación. */
@Injectable({ providedIn: 'root' })
export class AppInitializer {
  private readonly themeManagerService = inject(ThemeManagerService);
  private readonly authService = inject(AuthService);

  load(): Promise<void> {
    return new Promise((resolve) => {
      this.authService.initialize();
      this.themeManagerService.initialize();
      resolve();
    });
  }
}
