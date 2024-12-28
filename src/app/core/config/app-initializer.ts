import { inject, Injectable } from '@angular/core';
import { ThemeStateService } from '../../shared/components/layout/services/theme.state.service';
import { logError, logInfo } from '../errors/logger/logger';
import { AuthService } from '../modules/auth/services/auth.service';
import { LocaleStateService } from '../i18n/services/locale.state.service';
import { LuxonDateTimeService } from '../i18n/services/luxon-date-time.service';
import { TimeZoneStateService } from '../i18n/services/time-zone.state.service';

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
      this.localeStateService.initialize();
      this.timeZoneStateService.initialize();

      // Luego los servicios que dependen de ellos.
      this.luxonDateTimeService.initialize();

      // Inicializaciones paralelas que no dependen de locale/timezone.
      await Promise.all([this.authService.initialize(), Promise.resolve(this.themeStateService.refresh())]);

      logInfo('AppInitializer.load', 'Application initialized successfully');
    } catch (error) {
      logError('AppInitializer.load', 'Error initializing application', error);
      throw error;
    }
  }
}
