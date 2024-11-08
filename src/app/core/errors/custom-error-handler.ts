import { ErrorHandler } from '@angular/core';
import { logObject } from './log-messages';

export class CustomErrorHandler implements ErrorHandler {
  // eslint-disable-next-line
  handleError(error: any): void {
    logObject(error);

    throw error;
  }
}
