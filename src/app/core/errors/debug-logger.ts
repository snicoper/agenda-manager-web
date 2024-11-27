import { AppEnvironment } from '../config/app-environment';

/* eslint-disable  no-console  */

interface LogSettings {
  key: string;
  color: string;
}

enum LogLevel {
  Error = 'ERROR',
  Warning = 'WARNING',
  Info = 'INFO',
  Debug = 'DEBUG',
}

const logSettings = {
  [LogLevel.Error]: { key: LogLevel.Error, color: '#cc0066' },
  [LogLevel.Warning]: { key: LogLevel.Warning, color: '#cc7a00' },
  [LogLevel.Info]: { key: LogLevel.Info, color: '#4169e1' },
  [LogLevel.Debug]: { key: LogLevel.Debug, color: '#009933' },
} as const;

/**
 * Log a message to the console.
 *
 * @param formatMessage format message to log.
 * @param background background color.
 * @param data data to log.
 * @param type log type.
 */
const logToConsole = (formatMessage: string, background: string, data: unknown, type: string): void => {
  switch (type) {
    case LogLevel.Error:
      console.error(formatMessage, background, data);
      break;
    case LogLevel.Warning:
      console.warn(formatMessage, background, data);
      break;
    case LogLevel.Info:
      console.info(formatMessage, background, data);
      break;
    case LogLevel.Debug:
      console.log(formatMessage, background, data);
      break;
  }
};

/**
 * Formatea el mensaje de log.
 *
 * @param key key to log.
 * @param debugData data to log.
 * @returns string formated message.
 */
const formatLogMessage = (key: string, debugData: unknown): string => {
  if (debugData && typeof debugData === 'object') {
    return `%c ${key}:`;
  }

  return `%c ${key}: ${debugData}`;
};

/**
 * Muestra message solo si se esta en desarrollo.
 *
 * @param debugData data to log.
 * @param settings settings to log.
 * @returns void.
 */
const display = (debugData: unknown, settings: LogSettings): void => {
  if (AppEnvironment.isDebug) {
    const background = `background: ${settings.color}; color: white`;
    const formatMessage = formatLogMessage(settings.key, debugData);
    const data = debugData && typeof debugData === 'object' ? debugData : undefined;

    logToConsole(formatMessage, background, data, settings.key);
  }
};

/**
 * Muestra message de tipo error solo si se esta en desarrollo.
 *
 * @param debugData Error a mostrar.
 */
export const logError = (debugData: unknown): void => {
  display(debugData, logSettings[LogLevel.Error]);
};

/**
 * Muestra message de tipo warning solo si se esta en desarrollo.
 *
 * @param debugData Error a mostrar.
 */
export const logWarning = (debugData: unknown): void => {
  display(debugData, logSettings[LogLevel.Warning]);
};

/**
 * Muestra message de tipo info solo si se esta en desarrollo.
 *
 * @param debugData Error a mostrar.
 */
export const logInfo = (debugData: unknown): void => {
  display(debugData, logSettings[LogLevel.Info]);
};

/**
 * Muestra message de tipo debug solo si se esta en desarrollo.
 *
 * @param debugData Error a mostrar.
 */
export const logDebug = (debugData: unknown): void => {
  display(debugData, logSettings[LogLevel.Debug]);
};
