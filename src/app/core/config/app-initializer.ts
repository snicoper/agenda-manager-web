import { inject, Injectable } from '@angular/core';
import { ThemeStateService } from '../../shared/components/layout/services/theme.state.service';
import { logError, logInfo } from '../errors/debug-logger';
import { AuthService } from '../modules/auth/services/auth.service';
import { LuxonDateTimeService } from '../modules/i18n/services/luxon-date-time.service';
import { LocaleStateService } from '../modules/i18n/services/locale.state.service';
import { TimeZoneStateService } from '../modules/i18n/services/time-zone.state.service';

/** Configuración inicial de la aplicación. */
@Injectable({ providedIn: 'root' })
export class AppInitializer {
  private readonly authService = inject(AuthService);
  private readonly localeStateService = inject(LocaleStateService);
  private readonly timeZoneStateService = inject(TimeZoneStateService);
  private readonly luxonDateTimeService = inject(LuxonDateTimeService);
  private readonly themeStateService = inject(ThemeStateService);

  async load(): Promise<void> {
    try {
      // Primero inicializamos los estados base.
      this.localeStateService.refresh();
      this.timeZoneStateService.refresh();

      // Luego los servicios que dependen de ellos.
      this.luxonDateTimeService.refresh();

      // Inicializaciones paralelas que no dependen de locale/timezone.
      await Promise.all([this.authService.initialize(), Promise.resolve(this.themeStateService.refresh())]);

      logInfo('AppInitializer', 'Application initialized successfully');
    } catch (error) {
      logError('AppInitializer', 'Error initializing application', error);
      throw error;
    }
  }
}
