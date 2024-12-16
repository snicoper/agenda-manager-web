import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '../app/app.component';
import { logError } from '../app/core/errors/debug-logger';
import { backOfficeConfig } from './app.config';

bootstrapApplication(AppComponent, backOfficeConfig).catch((err) => logError(err));
