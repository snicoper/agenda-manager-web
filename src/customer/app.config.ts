import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appConfig } from '../app/app.config';
import { routes } from './app.routes';

export const customerConfig: ApplicationConfig = {
  ...appConfig,
  providers: [...appConfig.providers, provideRouter(routes)],
};
