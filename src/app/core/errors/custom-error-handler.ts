import { ErrorHandler } from '@angular/core';
import { logDebug } from './debug-logger';

export class CustomErrorHandler implements ErrorHandler {
  // eslint-disable-next-line
  handleError(error: any): void {
    logDebug(error);

    throw error;
  }
}
