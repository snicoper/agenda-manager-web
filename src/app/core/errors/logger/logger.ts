/**
 * Muestra un mensaje de error en la consola.
 * Solo se muestra en modo desarrollo.
 */
import { AppEnvironment } from '../../config/app-environment';
import { LogLevel } from './enums/log-level.enum';
import { LogSettings } from './models/log-settings.model';

const logSettings = {
  [LogLevel.Error]: { key: LogLevel.Error, color: '#cc0066' },
  [LogLevel.Warning]: { key: LogLevel.Warning, color: '#cc7a00' },
  [LogLevel.Info]: { key: LogLevel.Info, color: '#4169e1' },
} as const;

const logToConsole = (formatMessage: string, background: string, args: unknown[]): void => {
  const params = [formatMessage, background, ...args];

  // eslint-disable-next-line no-console
  console.log(...params);
};

const formatLogMessage = (key: string): string => {
  return `%c ${key}:`;
};

const display = (args: unknown[], settings: LogSettings): void => {
  if (AppEnvironment.IsDebug) {
    const background = `background: ${settings.color}; color: white; padding: 2px 5px; border-radius: 3px`;
    const formatMessage = formatLogMessage(settings.key);
    logToConsole(formatMessage, background, args);
  }
};

export const logError = (...args: unknown[]): void => {
  display(args, logSettings[LogLevel.Error]);
};

export const logWarning = (...args: unknown[]): void => {
  display(args, logSettings[LogLevel.Warning]);
};

export const logInfo = (...args: unknown[]): void => {
  display(args, logSettings[LogLevel.Info]);
};
