import { ErrorHandler } from '@angular/core';
import { logError } from './logger/logger.co';

/** Global error handler. */
export class CustomErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    logError(error);

    throw error;
  }
}
