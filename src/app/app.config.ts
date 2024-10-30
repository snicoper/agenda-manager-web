import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { CustomLuxonDateAdapter } from './shared/core/adapters/custom-luxon-date-adapter';
import { AppConfig } from './shared/core/config/app-config';
import { CustomErrorHandler } from './shared/core/errors/custom-error-handler';
import { TitleStrategyService } from './shared/services/title-strategy.service';

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

    { provide: TitleStrategy, useClass: TitleStrategyService },

    provideLuxonDateAdapter(),
    { provide: DateAdapter, useValue: new CustomLuxonDateAdapter('es-ES') },

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
