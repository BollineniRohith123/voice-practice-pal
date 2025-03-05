/**
 * Simple logger utility for the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logger class with methods for different log levels
 */
class Logger {
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Format log message with timestamp
   */
  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  /**
   * Log debug message
   */
  debug(message: string, ...args: any[]): void {
    if (this.isProduction) return;
    console.debug(this.formatMessage('debug', message), ...args);
  }

  /**
   * Log info message
   */
  info(message: string, ...args: any[]): void {
    console.info(this.formatMessage('info', message), ...args);
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage('warn', message), ...args);
  }

  /**
   * Log error message
   */
  error(message: string, ...args: any[]): void {
    console.error(this.formatMessage('error', message), ...args);
  }
}

// Export a singleton instance
export const logger = new Logger();