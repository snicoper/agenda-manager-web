import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appConfig } from '../app/app.config';
import { routes } from './app.routes';

export const backOfficeConfig: ApplicationConfig = {
  ...appConfig,
  providers: [...appConfig.providers, provideRouter(routes)],
};
