import { NextRequest } from 'next/server';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = {
      message: 'Too many requests, please try again later.',
      skipSuccessfulRequests: false,
      ...options,
    };
  }

  private getKey(request: NextRequest): string {
    // Use IP address as the key, fall back to user agent if IP is not available
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
               request.headers.get('x-real-ip') || 
               request.ip || 
               'unknown';
    
    return `${ip}:${request.nextUrl.pathname}`;
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  check(request: NextRequest): { 
    success: boolean; 
    remaining: number; 
    resetTime: number; 
    message?: string 
  } {
    this.cleanupExpiredEntries();
    
    const key = this.getKey(request);
    const now = Date.now();
    
    if (!this.store[key] || this.store[key].resetTime < now) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.options.windowMs,
      };
      
      return {
        success: true,
        remaining: this.options.max - 1,
        resetTime: this.store[key].resetTime,
      };
    }
    
    if (this.store[key].count >= this.options.max) {
      return {
        success: false,
        remaining: 0,
        resetTime: this.store[key].resetTime,
        message: this.options.message,
      };
    }
    
    this.store[key].count++;
    
    return {
      success: true,
      remaining: this.options.max - this.store[key].count,
      resetTime: this.store[key].resetTime,
    };
  }
}

// Pre-configured rate limiters for different endpoints
export const apiRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export const authRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: 'Too many authentication attempts, please try again later.',
});

export const contactRateLimit = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 contact form submissions per hour
  message: 'Too many contact form submissions, please try again later.',
});

export const uploadRateLimit = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 uploads per hour
  message: 'Too many file uploads, please try again later.',
});

// Utility function to apply rate limiting to API routes
export function withRateLimit(rateLimiter: RateLimiter) {
  return (request: NextRequest) => {
    const result = rateLimiter.check(request);
    
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.message,
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rateLimiter['options'].max),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.resetTime),
          },
        }
      );
    }
    
    return null; // No rate limit hit, continue processing
  };
}