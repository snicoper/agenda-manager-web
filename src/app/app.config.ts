import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS, provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { AppInitializer } from './core/config/app-initializer';
import { CustomErrorHandler } from './core/errors/custom-error-handler';
import { TitleStrategyService } from './core/services/title-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => inject(AppInitializer).load()),
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler,
    },

    { provide: TitleStrategy, useClass: TitleStrategyService },

    provideLuxonDateAdapter(),
    {
      provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
      useValue: {
        useUtc: true,
        firstDayOfWeek: 1,
      },
    },

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
