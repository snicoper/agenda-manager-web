import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideLuxonDateAdapter(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
  ],
};
