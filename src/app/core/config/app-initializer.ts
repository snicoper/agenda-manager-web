import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { logError, logInfo } from '../errors/debug-logger';
import { LuxonDateTimeService } from '../i18n/services/luxon-date-time.service';
import { LocaleState } from '../i18n/states/locale.state';
import { TimeZoneState } from '../i18n/states/time-zone.state';
import { ThemeState } from '../states/theme.state';

/** Configuración inicial de la aplicación. */
@Injectable({ providedIn: 'root' })
export class AppInitializer {
  private readonly authService = inject(AuthService);
  private readonly localeState = inject(LocaleState);
  private readonly timeZoneState = inject(TimeZoneState);
  private readonly luxonDateTimeService = inject(LuxonDateTimeService);
  private readonly themeState = inject(ThemeState);

  async load(): Promise<void> {
    try {
      // Primero inicializamos los estados base.
      this.localeState.refresh();
      this.timeZoneState.refresh();

      // Luego los servicios que dependen de ellos.
      this.luxonDateTimeService.refresh();

      // Inicializaciones paralelas que no dependen de locale/timezone.
      await Promise.all([this.authService.initialize(), Promise.resolve(this.themeState.refresh())]);

      logInfo('AppInitializer', 'Application initialized successfully');
    } catch (error) {
      logError('AppInitializer', 'Error initializing application', error);
      throw error;
    }
  }
}
