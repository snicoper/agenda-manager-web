import { inject, Injectable } from '@angular/core';
import { ThemeManagerService } from '../services/theme-manager.service';

/** Configuración inicial de la aplicación. */
@Injectable({ providedIn: 'root' })
export class AppInitializer {
  private readonly themeManagerService = inject(ThemeManagerService);

  load(): Promise<void> {
    return new Promise((resolve) => {
      this.themeManagerService.initialize();
      resolve();
    });
  }
}
