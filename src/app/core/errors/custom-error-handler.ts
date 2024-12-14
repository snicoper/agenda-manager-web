import { ErrorHandler } from '@angular/core';
import { logError } from './debug-logger';

export class CustomErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    logError(error);

    throw error;
  }
}
