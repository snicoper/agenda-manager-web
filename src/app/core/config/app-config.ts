import { inject, Injectable } from '@angular/core';
import { ThemeManagerService } from '../services/theme-manager.service';

/** Configuración inicial de la aplicación. */
@Injectable()
export class AppConfig {
  private readonly themeManagerService = inject(ThemeManagerService);

  load(): Promise<void> {
    return new Promise((resolve) => {
      this.themeManagerService.initialize();
      resolve();
    });
  }
}
