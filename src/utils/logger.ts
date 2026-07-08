type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const consoleMethod: Record<LogLevel, (message: string) => void> = {
  info: console.log,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};

function log(level: LogLevel, message: string): void {
  const timestamp = new Date().toISOString();
  consoleMethod[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

export const logger = {
  info: (message: string) => log('info', message),
  warn: (message: string) => log('warn', message),
  error: (message: string) => log('error', message),
  debug: (message: string) => log('debug', message),
};
