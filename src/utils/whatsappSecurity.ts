/**
 * WhatsApp Security & Rate Limiting Service
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Provides comprehensive security validation, rate limiting,
 * fraud detection, and protection against abuse.
 */

import { createHash, timingSafeEqual } from 'crypto';
import { 
  SecurityValidationResult, 
  RateLimitConfig, 
  WhatsAppGuest,
  TokenValidationResult
} from '../types/whatsapp';

interface SecurityEvent {
  id: string;
  timestamp: Date;
  eventType: 'token_access' | 'rate_limit_hit' | 'suspicious_activity' | 'invalid_token' | 'blocked_ip';
  ipAddress: string;
  userAgent?: string;
  guestToken?: string;
  guestId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: Record<string, any>;
}

interface RateLimitState {
  requests: number;
  resetTime: number;
  blocked: boolean;
  blockUntil?: number;
}

interface SecurityConfig {
  tokenValidation: {
    maxAttempts: number;
    lockoutDuration: number; // minutes
    requireHttps: boolean;
    allowedOrigins: string[];
  };
  rateLimiting: RateLimitConfig;
  fraudDetection: {
    maxTokensPerIP: number;
    maxFailedAttemptsPerIP: number;
    suspiciousPatterns: string[];
    geoBlockEnabled: boolean;
    allowedCountries: string[];
  };
  monitoring: {
    logSecurityEvents: boolean;
    alertOnSuspiciousActivity: boolean;
    maxSecurityEventsStorage: number;
  };
}

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  tokenValidation: {
    maxAttempts: 5,
    lockoutDuration: 15, // 15 minutes
    requireHttps: process.env.NODE_ENV === 'production',
    allowedOrigins: [
      'https://daleandkirsten.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ],
  },
  rateLimiting: {
    messagesPerMinute: 30,
    messagesPerHour: 1000,
    messagesPerDay: 2000,
    burstLimit: 10,
    cooldownPeriod: 5, // minutes
  },
  fraudDetection: {
    maxTokensPerIP: 10,
    maxFailedAttemptsPerIP: 20,
    suspiciousPatterns: [
      'bot', 'crawler', 'spider', 'scraper', 'hack', 'exploit'
    ],
    geoBlockEnabled: false, // Disabled for wedding invitations
    allowedCountries: ['ZA', 'US', 'GB', 'AU'], // South Africa, USA, UK, Australia
  },
  monitoring: {
    logSecurityEvents: true,
    alertOnSuspiciousActivity: true,
    maxSecurityEventsStorage: 10000,
  },
};

/**
 * WhatsApp Security Service
 */
export class WhatsAppSecurityService {
  private config: SecurityConfig;
  private rateLimitState: Map<string, RateLimitState> = new Map();
  private tokenAttempts: Map<string, { attempts: number; lockedUntil?: number }> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private blockedIPs: Set<string> = new Set();
  private trustedTokens: Set<string> = new Set();

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config };
  }

  /**
   * Validate token with comprehensive security checks
   */
  async validateTokenSecurity(
    token: string,
    ipAddress: string,
    userAgent: string,
    origin?: string
  ): Promise<SecurityValidationResult> {
    const validationStart = Date.now();
    
    try {
      // Basic input validation
      if (!token || token.length < 8 || token.length > 64) {
        return this.createSecurityResult(false, 'Invalid token format', {
          tokenExpired: false,
          tokenReused: false,
          rateLimited: false,
          suspiciousActivity: false,
          ipBlocked: false,
        });
      }

      // Check if IP is blocked
      if (this.blockedIPs.has(ipAddress)) {
        await this.recordSecurityEvent({
          eventType: 'blocked_ip',
          ipAddress,
          userAgent,
          guestToken: this.hashToken(token),
          severity: 'high',
          metadata: { reason: 'IP in blocklist' },
        });

        return this.createSecurityResult(false, 'IP address blocked', {
          tokenExpired: false,
          tokenReused: false,
          rateLimited: false,
          suspiciousActivity: true,
          ipBlocked: true,
        });
      }

      // Check rate limiting
      const rateLimitResult = this.checkRateLimit(ipAddress);
      if (!rateLimitResult.allowed) {
        await this.recordSecurityEvent({
          eventType: 'rate_limit_hit',
          ipAddress,
          userAgent,
          guestToken: this.hashToken(token),
          severity: 'medium',
          metadata: { 
            reason: rateLimitResult.reason,
            resetTime: rateLimitResult.resetTime,
          },
        });

        return this.createSecurityResult(false, 'Rate limit exceeded', {
          tokenExpired: false,
          tokenReused: false,
          rateLimited: true,
          suspiciousActivity: false,
          ipBlocked: false,
        }, rateLimitResult.resetTime);
      }

      // Check token attempts (brute force protection)
      const tokenKey = this.hashToken(token);
      const attemptData = this.tokenAttempts.get(tokenKey);
      if (attemptData?.lockedUntil && attemptData.lockedUntil > Date.now()) {
        return this.createSecurityResult(false, 'Token temporarily locked', {
          tokenExpired: false,
          tokenReused: false,
          rateLimited: false,
          suspiciousActivity: true,
          ipBlocked: false,
        }, attemptData.lockedUntil);
      }

      // Origin validation
      if (this.config.tokenValidation.requireHttps && origin) {
        if (!origin.startsWith('https://') && !origin.includes('localhost')) {
          await this.recordSecurityEvent({
            eventType: 'suspicious_activity',
            ipAddress,
            userAgent,
            guestToken: tokenKey,
            severity: 'medium',
            metadata: { reason: 'Non-HTTPS origin', origin },
          });

          return this.createSecurityResult(false, 'Secure connection required', {
            tokenExpired: false,
            tokenReused: false,
            rateLimited: false,
            suspiciousActivity: true,
            ipBlocked: false,
          });
        }

        // Check allowed origins
        const isAllowedOrigin = this.config.tokenValidation.allowedOrigins.some(allowed =>
          origin.startsWith(allowed)
        );

        if (!isAllowedOrigin) {
          await this.recordSecurityEvent({
            eventType: 'suspicious_activity',
            ipAddress,
            userAgent,
            guestToken: tokenKey,
            severity: 'high',
            metadata: { reason: 'Unauthorized origin', origin },
          });

          return this.createSecurityResult(false, 'Unauthorized origin', {
            tokenExpired: false,
            tokenReused: false,
            rateLimited: false,
            suspiciousActivity: true,
            ipBlocked: false,
          });
        }
      }

      // User agent analysis
      const suspiciousActivity = this.analyzeSuspiciousActivity(userAgent, ipAddress);
      if (suspiciousActivity.isSuspicious) {
        await this.recordSecurityEvent({
          eventType: 'suspicious_activity',
          ipAddress,
          userAgent,
          guestToken: tokenKey,
          severity: suspiciousActivity.severity,
          metadata: { 
            reason: suspiciousActivity.reason,
            patterns: suspiciousActivity.matchedPatterns,
          },
        });

        if (suspiciousActivity.severity === 'critical') {
          this.blockedIPs.add(ipAddress);
          return this.createSecurityResult(false, 'Suspicious activity detected', {
            tokenExpired: false,
            tokenReused: false,
            rateLimited: false,
            suspiciousActivity: true,
            ipBlocked: true,
          });
        }
      }

      // Record successful validation
      await this.recordSecurityEvent({
        eventType: 'token_access',
        ipAddress,
        userAgent,
        guestToken: tokenKey,
        severity: 'low',
        metadata: { 
          validationTime: Date.now() - validationStart,
          origin,
        },
      });

      return this.createSecurityResult(true, undefined, {
        tokenExpired: false,
        tokenReused: false,
        rateLimited: false,
        suspiciousActivity: false,
        ipBlocked: false,
      });

    } catch (error) {
      await this.recordSecurityEvent({
        eventType: 'suspicious_activity',
        ipAddress,
        userAgent,
        guestToken: this.hashToken(token),
        severity: 'high',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          validationTime: Date.now() - validationStart,
        },
      });

      return this.createSecurityResult(false, 'Validation error', {
        tokenExpired: false,
        tokenReused: false,
        rateLimited: false,
        suspiciousActivity: true,
        ipBlocked: false,
      });
    }
  }

  /**
   * Check rate limiting for IP address
   */
  checkRateLimit(ipAddress: string): {
    allowed: boolean;
    reason?: string;
    resetTime?: number;
    remainingRequests?: number;
  } {
    const now = Date.now();
    const state = this.rateLimitState.get(ipAddress);

    if (!state) {
      // First request from this IP
      this.rateLimitState.set(ipAddress, {
        requests: 1,
        resetTime: now + (60 * 1000), // 1 minute window
        blocked: false,
      });

      return { 
        allowed: true, 
        remainingRequests: this.config.rateLimiting.messagesPerMinute - 1 
      };
    }

    // Check if we're in a blocked state
    if (state.blocked && state.blockUntil && state.blockUntil > now) {
      return {
        allowed: false,
        reason: 'IP temporarily blocked',
        resetTime: state.blockUntil,
      };
    }

    // Reset window if expired
    if (now > state.resetTime) {
      state.requests = 1;
      state.resetTime = now + (60 * 1000);
      state.blocked = false;
      state.blockUntil = undefined;
      return { 
        allowed: true, 
        remainingRequests: this.config.rateLimiting.messagesPerMinute - 1 
      };
    }

    // Check burst limit
    if (state.requests >= this.config.rateLimiting.burstLimit) {
      state.blocked = true;
      state.blockUntil = now + (this.config.rateLimiting.cooldownPeriod * 60 * 1000);
      return {
        allowed: false,
        reason: 'Burst limit exceeded',
        resetTime: state.blockUntil,
      };
    }

    // Check rate limit
    if (state.requests >= this.config.rateLimiting.messagesPerMinute) {
      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        resetTime: state.resetTime,
      };
    }

    // Allow request
    state.requests++;
    return { 
      allowed: true, 
      remainingRequests: this.config.rateLimiting.messagesPerMinute - state.requests 
    };
  }

  /**
   * Validate individual guest token
   */
  async validateGuestToken(
    token: string,
    guestData: WhatsAppGuest,
    ipAddress: string
  ): Promise<TokenValidationResult> {
    const tokenKey = this.hashToken(token);

    // Check if token has been used
    if (guestData.rsvp_completed) {
      await this.recordSecurityEvent({
        eventType: 'invalid_token',
        ipAddress,
        guestToken: tokenKey,
        guestId: guestData.id,
        severity: 'low',
        metadata: { reason: 'Token already used' },
      });

      return {
        isValid: false,
        guest: guestData,
        error: 'Token has already been used',
        securityFlags: {
          rateLimited: false,
          suspiciousActivity: false,
          ipBlocked: false,
          tokenExpired: false,
          tokenReused: true,
        },
      };
    }

    // Check token expiry (if applicable)
    const isExpired = guestData.token_expired || false;
    if (isExpired) {
      await this.recordSecurityEvent({
        eventType: 'invalid_token',
        ipAddress,
        guestToken: tokenKey,
        guestId: guestData.id,
        severity: 'low',
        metadata: { reason: 'Token expired' },
      });

      return {
        isValid: false,
        guest: guestData,
        error: 'Token has expired',
        securityFlags: {
          rateLimited: false,
          suspiciousActivity: false,
          ipBlocked: false,
          tokenExpired: true,
          tokenReused: false,
        },
      };
    }

    // Token is valid
    return {
      isValid: true,
      guest: guestData,
      token,
      securityFlags: {
        rateLimited: false,
        suspiciousActivity: false,
        ipBlocked: false,
        tokenExpired: false,
        tokenReused: false,
      },
    };
  }

  /**
   * Analyze suspicious activity patterns
   */
  private analyzeSuspiciousActivity(
    userAgent: string,
    ipAddress: string
  ): {
    isSuspicious: boolean;
    severity: SecurityEvent['severity'];
    reason: string;
    matchedPatterns: string[];
  } {
    const matchedPatterns: string[] = [];
    let severity: SecurityEvent['severity'] = 'low';

    // Check for bot patterns
    const lowerAgent = userAgent.toLowerCase();
    const suspiciousPatterns = this.config.fraudDetection.suspiciousPatterns;
    
    for (const pattern of suspiciousPatterns) {
      if (lowerAgent.includes(pattern)) {
        matchedPatterns.push(pattern);
        severity = pattern === 'hack' || pattern === 'exploit' ? 'critical' : 'medium';
      }
    }

    // Check for missing or suspicious user agent
    if (!userAgent || userAgent.length < 10) {
      matchedPatterns.push('missing_user_agent');
      severity = 'medium';
    }

    // Check for rapid requests from same IP
    const recentEvents = this.securityEvents.filter(e => 
      e.ipAddress === ipAddress && 
      e.timestamp.getTime() > Date.now() - (60 * 1000) // Last minute
    );

    if (recentEvents.length > 10) {
      matchedPatterns.push('rapid_requests');
      severity = 'high';
    }

    // Check for token enumeration attempts
    const tokenAttempts = recentEvents.filter(e => e.eventType === 'invalid_token');
    if (tokenAttempts.length > 5) {
      matchedPatterns.push('token_enumeration');
      severity = 'critical';
    }

    return {
      isSuspicious: matchedPatterns.length > 0,
      severity,
      reason: `Suspicious patterns detected: ${matchedPatterns.join(', ')}`,
      matchedPatterns,
    };
  }

  /**
   * Record security event
   */
  private async recordSecurityEvent(eventData: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    if (!this.config.monitoring.logSecurityEvents) return;

    const event: SecurityEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      ...eventData,
    };

    this.securityEvents.push(event);

    // Maintain storage limit
    if (this.securityEvents.length > this.config.monitoring.maxSecurityEventsStorage) {
      this.securityEvents.splice(0, this.securityEvents.length - this.config.monitoring.maxSecurityEventsStorage);
    }

    // Alert on critical events
    if (this.config.monitoring.alertOnSuspiciousActivity && event.severity === 'critical') {
      console.warn('CRITICAL SECURITY EVENT:', event);
      // In production, this would trigger alerts to administrators
    }
  }

  /**
   * Get security analytics and insights
   */
  getSecurityAnalytics(timeframe: number = 24): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    topThreats: Array<{ ip: string; events: number; severity: string }>;
    blockedIPs: number;
    recommendations: string[];
  } {
    const cutoff = new Date(Date.now() - (timeframe * 60 * 60 * 1000));
    const recentEvents = this.securityEvents.filter(e => e.timestamp > cutoff);

    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    const ipThreatMap = new Map<string, { events: number; maxSeverity: string }>();

    recentEvents.forEach(event => {
      // Count by type
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      
      // Count by severity
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
      
      // Track by IP
      const ipData = ipThreatMap.get(event.ipAddress) || { events: 0, maxSeverity: 'low' };
      ipData.events++;
      if (this.getSeverityLevel(event.severity) > this.getSeverityLevel(ipData.maxSeverity)) {
        ipData.maxSeverity = event.severity;
      }
      ipThreatMap.set(event.ipAddress, ipData);
    });

    const topThreats = Array.from(ipThreatMap.entries())
      .map(([ip, data]) => ({ ip, events: data.events, severity: data.maxSeverity }))
      .sort((a, b) => b.events - a.events)
      .slice(0, 10);

    const recommendations = this.generateSecurityRecommendations(recentEvents);

    return {
      totalEvents: recentEvents.length,
      eventsByType,
      eventsBySeverity,
      topThreats,
      blockedIPs: this.blockedIPs.size,
      recommendations,
    };
  }

  /**
   * Clean up expired data
   */
  cleanup(): void {
    const now = Date.now();
    
    // Clean up expired rate limit states
    for (const [ip, state] of this.rateLimitState.entries()) {
      if (state.resetTime < now && (!state.blockUntil || state.blockUntil < now)) {
        this.rateLimitState.delete(ip);
      }
    }

    // Clean up expired token attempt locks
    for (const [tokenKey, attempt] of this.tokenAttempts.entries()) {
      if (attempt.lockedUntil && attempt.lockedUntil < now) {
        this.tokenAttempts.delete(tokenKey);
      }
    }

    // Clean up old security events
    const oneWeekAgo = new Date(now - (7 * 24 * 60 * 60 * 1000));
    this.securityEvents = this.securityEvents.filter(e => e.timestamp > oneWeekAgo);
  }

  // Helper methods

  private createSecurityResult(
    isValid: boolean,
    error?: string,
    securityFlags: SecurityValidationResult['securityFlags'] = {
      rateLimited: false,
      suspiciousActivity: false,
      ipBlocked: false,
      tokenExpired: false,
      tokenReused: false,
    },
    lockoutUntil?: number
  ): SecurityValidationResult {
    return {
      isValid,
      error,
      securityFlags,
      lockoutUntil: lockoutUntil ? new Date(lockoutUntil) : undefined,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex').substring(0, 16);
  }

  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSeverityLevel(severity: string): number {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    return levels[severity as keyof typeof levels] || 0;
  }

  private generateSecurityRecommendations(events: SecurityEvent[]): string[] {
    const recommendations: string[] = [];

    const rateLimitEvents = events.filter(e => e.eventType === 'rate_limit_hit');
    if (rateLimitEvents.length > 10) {
      recommendations.push('Consider implementing CAPTCHA for high-traffic periods');
    }

    const suspiciousEvents = events.filter(e => e.eventType === 'suspicious_activity');
    if (suspiciousEvents.length > 5) {
      recommendations.push('Review and tighten user agent filtering rules');
    }

    const blockedIPEvents = events.filter(e => e.eventType === 'blocked_ip');
    if (blockedIPEvents.length > 0) {
      recommendations.push('Consider implementing IP whitelisting for trusted sources');
    }

    if (this.blockedIPs.size > 10) {
      recommendations.push('Review blocked IP list and consider implementing temporary blocks');
    }

    return recommendations;
  }

  // Public methods for managing security

  /**
   * Manually block an IP address
   */
  blockIP(ipAddress: string, reason: string): void {
    this.blockedIPs.add(ipAddress);
    this.recordSecurityEvent({
      eventType: 'blocked_ip',
      ipAddress,
      severity: 'high',
      metadata: { reason: `Manually blocked: ${reason}` },
    });
  }

  /**
   * Unblock an IP address
   */
  unblockIP(ipAddress: string): void {
    this.blockedIPs.delete(ipAddress);
  }

  /**
   * Check if IP is blocked
   */
  isIPBlocked(ipAddress: string): boolean {
    return this.blockedIPs.has(ipAddress);
  }

  /**
   * Get blocked IPs list
   */
  getBlockedIPs(): string[] {
    return Array.from(this.blockedIPs);
  }

  /**
   * Export security data for analysis
   */
  exportSecurityData(): {
    events: SecurityEvent[];
    blockedIPs: string[];
    rateLimitStates: Array<{ ip: string; state: RateLimitState }>;
    config: SecurityConfig;
    exportedAt: string;
  } {
    return {
      events: this.securityEvents,
      blockedIPs: Array.from(this.blockedIPs),
      rateLimitStates: Array.from(this.rateLimitState.entries()).map(([ip, state]) => ({ ip, state })),
      config: this.config,
      exportedAt: new Date().toISOString(),
    };
  }
}

// Export default instance
export const whatsappSecurity = new WhatsAppSecurityService();

// Utility functions
export function sanitizeInput(input: string): string {
  return input.replace(/[<>\"'&]/g, '');
}

export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

export function getClientIP(request: Request): string {
  // In a real application, you'd extract this from request headers
  return '127.0.0.1'; // Placeholder
}

export function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export default WhatsAppSecurityService;