import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { CustomLuxonDateAdapter } from './shared/core/adapters/custom-luxon-date-adapter';
import { AppConfig } from './shared/core/config/app-config';
import { CustomErrorHandler } from './shared/core/errors/custom-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: AppConfig) => (): Promise<void> => config.load(),
      multi: true,
      deps: [AppConfig],
    },
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler,
    },

    provideLuxonDateAdapter(),
    { provide: DateAdapter, useValue: new CustomLuxonDateAdapter('es-ES') },

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
