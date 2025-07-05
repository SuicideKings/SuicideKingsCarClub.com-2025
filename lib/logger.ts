type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context } = entry;
    
    if (this.isDevelopment) {
      // Colorful development logging
      const colors = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
      };
      const reset = '\x1b[0m';
      
      return `${colors[level]}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}${
        context ? `\n${JSON.stringify(context, null, 2)}` : ''
      }`;
    }
    
    // Structured JSON logging for production
    return JSON.stringify(entry);
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    const formattedLog = this.formatLog(entry);
    
    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedLog);
        }
        break;
      case 'info':
        console.info(formattedLog);
        break;
      case 'warn':
        console.warn(formattedLog);
        break;
      case 'error':
        console.error(formattedLog);
        break;
    }

    // In production, you might want to send logs to external service
    if (this.isProduction && (level === 'error' || level === 'warn')) {
      // TODO: Send to external logging service (e.g., DataDog, LogRocket, Sentry)
      // this.sendToExternalLogger(entry);
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
  }

  // Security-focused logging methods
  security(message: string, context?: Record<string, any>) {
    this.warn(`[SECURITY] ${message}`, {
      ...context,
      securityEvent: true,
    });
  }

  audit(action: string, context?: Record<string, any>) {
    this.info(`[AUDIT] ${action}`, {
      ...context,
      auditEvent: true,
    });
  }

  // API request logging
  apiRequest(method: string, path: string, context?: Record<string, any>) {
    this.info(`API ${method} ${path}`, {
      ...context,
      apiRequest: true,
    });
  }

  apiError(method: string, path: string, error: Error, context?: Record<string, any>) {
    this.error(`API ${method} ${path} failed`, {
      ...context,
      error: {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      },
      apiError: true,
    });
  }

  // Database operation logging
  dbQuery(query: string, duration?: number, context?: Record<string, any>) {
    this.debug(`DB Query: ${query}`, {
      ...context,
      duration,
      dbQuery: true,
    });
  }

  dbError(operation: string, error: Error, context?: Record<string, any>) {
    this.error(`DB ${operation} failed`, {
      ...context,
      error: {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      },
      dbError: true,
    });
  }

  // Authentication logging
  authSuccess(userId: string, method: string, context?: Record<string, any>) {
    this.audit(`Authentication successful: ${method}`, {
      ...context,
      userId,
      authEvent: true,
    });
  }

  authFailure(email: string, method: string, reason: string, context?: Record<string, any>) {
    this.security(`Authentication failed: ${method} - ${reason}`, {
      ...context,
      email,
      authEvent: true,
    });
  }

  // File operation logging
  fileUpload(filename: string, size: number, userId?: string, context?: Record<string, any>) {
    this.audit(`File uploaded: ${filename}`, {
      ...context,
      userId,
      filename,
      size,
      fileOperation: true,
    });
  }

  fileError(operation: string, filename: string, error: Error, context?: Record<string, any>) {
    this.error(`File ${operation} failed: ${filename}`, {
      ...context,
      filename,
      error: {
        name: error.name,
        message: error.message,
      },
      fileError: true,
    });
  }

  // Rate limiting logging
  rateLimitHit(path: string, ip: string, context?: Record<string, any>) {
    this.security(`Rate limit hit: ${path}`, {
      ...context,
      path,
      ip,
      rateLimitEvent: true,
    });
  }

  // Performance logging
  performance(operation: string, duration: number, context?: Record<string, any>) {
    const level = duration > 1000 ? 'warn' : 'info';
    this.log(level, `Performance: ${operation} took ${duration}ms`, {
      ...context,
      duration,
      performanceEvent: true,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Error boundary helper
export function withErrorLogging<T extends (...args: any[]) => any>(
  fn: T,
  operation: string
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error: Error) => {
          logger.error(`${operation} failed`, {
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
            operation,
          });
          throw error;
        });
      }
      
      return result;
    } catch (error) {
      logger.error(`${operation} failed`, {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : { message: String(error) },
        operation,
      });
      throw error;
    }
  }) as T;
}

// Request context helper for API routes
export function createRequestLogger(request: Request) {
  const url = new URL(request.url);
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return {
    info: (message: string, context?: Record<string, any>) => 
      logger.info(message, { ...context, ip, userAgent, path: url.pathname }),
    warn: (message: string, context?: Record<string, any>) => 
      logger.warn(message, { ...context, ip, userAgent, path: url.pathname }),
    error: (message: string, context?: Record<string, any>) => 
      logger.error(message, { ...context, ip, userAgent, path: url.pathname }),
    security: (message: string, context?: Record<string, any>) => 
      logger.security(message, { ...context, ip, userAgent, path: url.pathname }),
    audit: (action: string, context?: Record<string, any>) => 
      logger.audit(action, { ...context, ip, userAgent, path: url.pathname }),
  };
}

export default logger;