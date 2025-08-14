/**
 * Production Security Hardening for Wedding RSVP App
 * Comprehensive security measures for bulletproof production deployment
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Security configuration
interface SecurityConfig {
  rateLimiting: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
  };
  csrf: {
    enabled: boolean;
    tokenLength: number;
  };
  validation: {
    maxInputLength: number;
    allowedFileTypes: string[];
    maxFileSize: number;
  };
  headers: {
    hsts: boolean;
    nosniff: boolean;
    frameOptions: string;
    xssProtection: boolean;
  };
}

const SECURITY_CONFIG: SecurityConfig = {
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '60'),
    skipSuccessfulRequests: false,
  },
  csrf: {
    enabled: process.env.NODE_ENV === 'production',
    tokenLength: 32,
  },
  validation: {
    maxInputLength: 1000,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
  headers: {
    hsts: process.env.NODE_ENV === 'production',
    nosniff: true,
    frameOptions: 'DENY',
    xssProtection: true,
  },
};

// In-memory rate limiting store (use Redis in production for multiple instances)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate Limiting Middleware
 */
export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = SECURITY_CONFIG.rateLimiting.windowMs, maxRequests: number = SECURITY_CONFIG.rateLimiting.maxRequests) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  check(identifier: string): { allowed: boolean; remainingRequests: number; resetTime: number } {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      const resetTime = now + this.windowMs;
      rateLimitStore.set(identifier, { count: 1, resetTime });
      return {
        allowed: true,
        remainingRequests: this.maxRequests - 1,
        resetTime,
      };
    }

    if (record.count >= this.maxRequests) {
      return {
        allowed: false,
        remainingRequests: 0,
        resetTime: record.resetTime,
      };
    }

    record.count++;
    rateLimitStore.set(identifier, record);

    return {
      allowed: true,
      remainingRequests: this.maxRequests - record.count,
      resetTime: record.resetTime,
    };
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }
}

/**
 * CSRF Protection
 */
export class CSRFProtection {
  private static readonly TOKEN_HEADER = 'x-csrf-token';
  private static readonly TOKEN_COOKIE = 'csrf-token';

  static generateToken(): string {
    return crypto.randomBytes(SECURITY_CONFIG.csrf.tokenLength).toString('hex');
  }

  static validateToken(request: NextRequest, token: string): boolean {
    if (!SECURITY_CONFIG.csrf.enabled) return true;

    const headerToken = request.headers.get(CSRFProtection.TOKEN_HEADER);
    const cookieToken = request.cookies.get(CSRFProtection.TOKEN_COOKIE)?.value;

    return token === headerToken && token === cookieToken;
  }

  static setTokenResponse(response: NextResponse, token: string): NextResponse {
    if (!SECURITY_CONFIG.csrf.enabled) return response;

    response.cookies.set(CSRFProtection.TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    });

    response.headers.set(CSRFProtection.TOKEN_HEADER, token);
    return response;
  }
}

/**
 * Input Validation and Sanitization
 */
export class InputValidator {
  /**
   * Sanitize input to prevent XSS attacks
   */
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .substring(0, SECURITY_CONFIG.validation.maxInputLength);
  }

  /**
   * Validate email format with additional security checks
   */
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const sanitized = InputValidator.sanitizeInput(email);
    
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(sanitized)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    // Additional security checks
    if (sanitized.includes('..') || sanitized.includes('--')) {
      return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true };
  }

  /**
   * Validate guest token format
   */
  static validateGuestToken(token: string): { isValid: boolean; error?: string } {
    const sanitized = InputValidator.sanitizeInput(token);
    
    // Token should be alphanumeric with hyphens, 8-64 characters
    const tokenRegex = /^[a-zA-Z0-9\-_]{8,64}$/;
    
    if (!tokenRegex.test(sanitized)) {
      return { isValid: false, error: 'Invalid token format' };
    }

    return { isValid: true };
  }

  /**
   * Validate RSVP form data
   */
  static validateRSVPData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate required fields
    if (!data.attending || typeof data.attending !== 'boolean') {
      errors.push('Attendance selection is required');
    }

    if (data.guest_name) {
      const sanitizedName = InputValidator.sanitizeInput(data.guest_name);
      if (sanitizedName.length < 2 || sanitizedName.length > 100) {
        errors.push('Guest name must be between 2 and 100 characters');
      }
    }

    if (data.email) {
      const emailValidation = InputValidator.validateEmail(data.email);
      if (!emailValidation.isValid) {
        errors.push(emailValidation.error || 'Invalid email');
      }
    }

    if (data.dietary_restrictions) {
      const sanitized = InputValidator.sanitizeInput(data.dietary_restrictions);
      if (sanitized.length > 500) {
        errors.push('Dietary restrictions must be less than 500 characters');
      }
    }

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * SQL Injection Prevention (for raw queries)
 */
export class SQLInjectionPrevention {
  private static readonly SUSPICIOUS_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(\bOR\s+\d+\s*=\s*\d+)/gi,
    /(\bAND\s+\d+\s*=\s*\d+)/gi,
    /(['"])\s*;\s*\w+/gi,
    /\b(exec|execute)\s*\(/gi,
  ];

  static containsSQLInjection(input: string): boolean {
    const sanitized = InputValidator.sanitizeInput(input);
    return SQLInjectionPrevention.SUSPICIOUS_PATTERNS.some(pattern => pattern.test(sanitized));
  }

  static sanitizeForSQL(input: string): string {
    return InputValidator.sanitizeInput(input)
      .replace(/['"\\]/g, '') // Remove quotes and backslashes
      .replace(/[;()]/g, ''); // Remove SQL control characters
  }
}

/**
 * Security Headers Middleware
 */
export function setSecurityHeaders(response: NextResponse): NextResponse {
  if (SECURITY_CONFIG.headers.hsts) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  if (SECURITY_CONFIG.headers.nosniff) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }

  response.headers.set('X-Frame-Options', SECURITY_CONFIG.headers.frameOptions);

  if (SECURITY_CONFIG.headers.xssProtection) {
    response.headers.set('X-XSS-Protection', '1; mode=block');
  }

  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://api.emailjs.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co https://api.emailjs.com https://www.google-analytics.com",
    "frame-ancestors 'none'",
    `report-uri ${process.env.VITE_CSP_REPORT_URI || '/api/csp-report'}`
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

/**
 * Security Event Logging
 */
export class SecurityLogger {
  static logSecurityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      details: {
        ...details,
        userAgent: details.userAgent,
        ip: details.ip,
        url: details.url,
      },
    };

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.error('[SECURITY]', JSON.stringify(logEntry));
      
      // Send to monitoring service (Sentry, DataDog, etc.)
      if (severity === 'high' || severity === 'critical') {
        // Alert immediately for high/critical events
      }
    } else {
      console.warn('[SECURITY]', logEntry);
    }
  }
}

/**
 * Request Information Extractor
 */
export function getRequestInfo(request: NextRequest) {
  return {
    ip: request.ip || 
        request.headers.get('x-forwarded-for') || 
        request.headers.get('x-real-ip') || 
        'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    url: request.url,
    method: request.method,
    timestamp: Date.now(),
  };
}

/**
 * Main Security Middleware
 */
export async function securityMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const requestInfo = getRequestInfo(request);
  const rateLimiter = new RateLimiter();

  // Rate limiting check
  const rateLimit = rateLimiter.check(requestInfo.ip);
  if (!rateLimit.allowed) {
    SecurityLogger.logSecurityEvent('rate_limit_exceeded', {
      ...requestInfo,
      remainingRequests: rateLimit.remainingRequests,
    }, 'medium');

    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // Basic security checks
  const userAgent = requestInfo.userAgent.toLowerCase();
  const suspiciousPatterns = ['sqlmap', 'nmap', 'nikto', 'acunetix', 'burpsuite'];
  
  if (suspiciousPatterns.some(pattern => userAgent.includes(pattern))) {
    SecurityLogger.logSecurityEvent('suspicious_user_agent', requestInfo, 'high');
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  // Continue with request
  return null;
}

// Cleanup old rate limit entries every 5 minutes
if (typeof window === 'undefined') {
  const rateLimiter = new RateLimiter();
  setInterval(() => {
    rateLimiter.cleanup();
  }, 5 * 60 * 1000);
}

export { SECURITY_CONFIG, RateLimiter, CSRFProtection, InputValidator, SQLInjectionPrevention, SecurityLogger };