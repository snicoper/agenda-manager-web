import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS, provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { AppInitializer } from './core/config/app-initializer';
import { CustomErrorHandler } from './core/errors/custom-error-handler';
import { ApiErrorInterceptor } from './core/interceptors/api-error.interceptor';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { PaginatedResultInterceptor } from './core/interceptors/paginated-result.interceptor';
import { TitleStrategyService } from './shared/components/layout/services/title-strategy.service';

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
      provide: MAT_DATE_LOCALE,
      useValue: 'es-ES',
    },
    {
      provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
      useValue: {
        firstDayOfWeek: 1,
      },
    },

    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: PaginatedResultInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor, multi: true },

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
