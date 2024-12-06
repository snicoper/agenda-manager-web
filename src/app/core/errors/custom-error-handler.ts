import { ErrorHandler } from '@angular/core';
import { logError } from './debug-logger';

export class CustomErrorHandler implements ErrorHandler {
  // eslint-disable-next-line
  handleError(error: any): void {
    logError(error);

    throw error;
  }
}
