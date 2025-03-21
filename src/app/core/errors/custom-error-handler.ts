import { ErrorHandler } from '@angular/core';
import { logError } from './logger/logger';

/** Global error handler. */
export class CustomErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    logError('CustomErrorHandler.handleError', error);

    throw error;
  }
}
