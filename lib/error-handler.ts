import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from './logger';

// Custom error types
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: string[]) {
    super(message, 400, true, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, true, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, true, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, true, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, true, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, true, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, false, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(message || `${service} service unavailable`, 503, false, 'EXTERNAL_SERVICE_ERROR');
    this.name = 'ExternalServiceError';
  }
}

// Error response interface
interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: string[];
  timestamp: string;
  requestId?: string;
}

// Error handler for API routes
export function handleApiError(
  error: unknown,
  request?: Request,
  context?: Record<string, any>
): NextResponse<ErrorResponse> {
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  
  // Log the error with context
  const logContext = {
    ...context,
    requestId,
    url: request?.url,
    method: request?.method,
    userAgent: request?.headers.get('user-agent'),
    ip: request?.headers.get('x-forwarded-for'),
  };

  if (error instanceof AppError) {
    // Known application errors
    if (error.isOperational) {
      logger.warn(`Operational error: ${error.message}`, {
        ...logContext,
        statusCode: error.statusCode,
        code: error.code,
      });
    } else {
      logger.error(`System error: ${error.message}`, {
        ...logContext,
        statusCode: error.statusCode,
        code: error.code,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        timestamp,
        requestId,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    // Validation errors from Zod
    const details = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    
    logger.warn('Validation error', {
      ...logContext,
      details,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details,
        timestamp,
        requestId,
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    // Unknown errors
    logger.error(`Unhandled error: ${error.message}`, {
      ...logContext,
      stack: error.stack,
      name: error.name,
    });

    // Don't leak internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      {
        success: false,
        error: isDevelopment ? error.message : 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp,
        requestId,
        ...(isDevelopment && { stack: error.stack }),
      },
      { status: 500 }
    );
  }

  // Non-Error objects
  logger.error('Unknown error type', {
    ...logContext,
    error: String(error),
  });

  return NextResponse.json(
    {
      success: false,
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      timestamp,
      requestId,
    },
    { status: 500 }
  );
}

// Async error wrapper for API routes
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  context?: Record<string, any>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Extract request from arguments if available
      const request = args.find(arg => arg && typeof arg === 'object' && 'url' in arg) as Request | undefined;
      
      throw handleApiError(error, request, context);
    }
  };
}

// Database error mapper
export function mapDatabaseError(error: any): AppError {
  if (error.code === '23505') {
    // PostgreSQL unique violation
    return new ConflictError('Resource already exists');
  }
  
  if (error.code === '23503') {
    // PostgreSQL foreign key violation
    return new ValidationError('Referenced resource does not exist');
  }
  
  if (error.code === '23502') {
    // PostgreSQL not null violation
    return new ValidationError('Required field is missing');
  }
  
  if (error.code === 'P2002') {
    // Prisma unique constraint violation
    return new ConflictError('Resource already exists');
  }
  
  if (error.code === 'P2025') {
    // Prisma record not found
    return new NotFoundError();
  }
  
  // Generic database error
  return new DatabaseError(error.message || 'Database operation failed');
}

// Validation helper
export function validateOrThrow<T>(
  validator: () => T,
  errorMessage?: string
): T {
  try {
    return validator();
  } catch (error) {
    if (error instanceof ZodError) {
      throw error; // Re-throw Zod errors as-is
    }
    throw new ValidationError(errorMessage || 'Validation failed');
  }
}

// Authentication helper
export function requireAuth(token: any, message?: string): void {
  if (!token) {
    throw new AuthenticationError(message);
  }
}

// Authorization helper
export function requireRole(token: any, role: string, message?: string): void {
  requireAuth(token);
  if (token.role !== role) {
    throw new AuthorizationError(message || `${role} role required`);
  }
}

// Resource existence helper
export function requireResource<T>(resource: T | null | undefined, name: string = 'Resource'): T {
  if (!resource) {
    throw new NotFoundError(name);
  }
  return resource;
}

// Rate limit helper
export function checkRateLimit(isRateLimited: boolean, message?: string): void {
  if (isRateLimited) {
    throw new RateLimitError(message);
  }
}

// External service helper
export function handleExternalServiceError(service: string, error: any): never {
  logger.error(`External service error: ${service}`, {
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : { message: String(error) },
    service,
  });
  
  throw new ExternalServiceError(service, `Failed to communicate with ${service}`);
}

// Performance monitoring helper
export function withPerformanceLogging<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  operation: string
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    
    try {
      const result = await handler(...args);
      const duration = Date.now() - startTime;
      
      logger.performance(operation, duration);
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.performance(`${operation} (failed)`, duration, {
        error: error instanceof Error ? error.message : String(error),
      });
      
      throw error;
    }
  };
}

export default {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
  handleApiError,
  withErrorHandler,
  mapDatabaseError,
  validateOrThrow,
  requireAuth,
  requireRole,
  requireResource,
  checkRateLimit,
  handleExternalServiceError,
  withPerformanceLogging,
};