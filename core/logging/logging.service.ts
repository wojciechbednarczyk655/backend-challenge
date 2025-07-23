import { Injectable, Logger } from '@nestjs/common';

const LOG_LEVELS = ['error', 'warn', 'log', 'info', 'debug'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

@Injectable()
export class LoggingService extends Logger {
  private readonly logLevel: LogLevel;

  constructor(context: string = 'App') {
    super(context);
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'log';
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS.indexOf(level) <= LOG_LEVELS.indexOf(this.logLevel);
  }

  log(message: string, context?: string): void {
    if (this.shouldLog('log')) super.log(this.format(message), context);
  }

  info(message: string, context?: string): void {
    if (this.shouldLog('info')) this.log(message, context);
  }

  warn(message: string, context?: string): void {
    if (this.shouldLog('warn')) super.warn(this.format(message), context);
  }

  error(message: string, trace?: string, context?: string): void {
    if (this.shouldLog('error'))
      super.error(this.format(message), trace, context);
  }

  debug(message: string, context?: string): void {
    if (this.shouldLog('debug')) super.debug(this.format(message), context);
  }

  setContext(context: string) {
    this.context = context;
  }

  private format(message: string): string {
    const base = {
      timestamp: new Date().toISOString(),
      context: this.context,
      message,
    };
    return JSON.stringify(base);
  }
}
