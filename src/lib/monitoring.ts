/**
 * Comprehensive Monitoring and Alerting System
 * Real-time monitoring for wedding day production readiness
 */

interface AlertLevel {
  level: 'info' | 'warning' | 'error' | 'critical';
  threshold: number;
  message: string;
  actions: string[];
}

interface MetricAlert {
  name: string;
  value: number;
  threshold: number;
  level: AlertLevel['level'];
  timestamp: number;
  context?: Record<string, any>;
}

interface MonitoringConfig {
  enabled: boolean;
  reportingInterval: number; // milliseconds
  alerts: Record<string, AlertLevel>;
  endpoints: {
    webhook?: string;
    slack?: string;
    email?: string;
    sentry?: string;
  };
}

const MONITORING_CONFIG: MonitoringConfig = {
  enabled: process.env.NODE_ENV === 'production',
  reportingInterval: 60000, // 1 minute
  alerts: {
    // Response time alerts
    response_time_warning: {
      level: 'warning',
      threshold: 2000, // 2 seconds
      message: 'Response time is slower than expected',
      actions: ['Check server resources', 'Monitor database performance'],
    },
    response_time_critical: {
      level: 'critical',
      threshold: 5000, // 5 seconds
      message: 'Response time is critically slow',
      actions: ['Immediate investigation required', 'Consider scaling resources'],
    },
    
    // Error rate alerts
    error_rate_warning: {
      level: 'warning',
      threshold: 0.05, // 5%
      message: 'Error rate is elevated',
      actions: ['Check error logs', 'Monitor for patterns'],
    },
    error_rate_critical: {
      level: 'critical',
      threshold: 0.15, // 15%
      message: 'Error rate is critically high',
      actions: ['Immediate investigation', 'Consider rollback'],
    },
    
    // RSVP specific alerts
    rsvp_submission_failure: {
      level: 'error',
      threshold: 3, // 3 failures in monitoring window
      message: 'Multiple RSVP submission failures detected',
      actions: ['Check database connectivity', 'Verify email service'],
    },
    
    // Security alerts
    rate_limit_exceeded: {
      level: 'warning',
      threshold: 10, // 10 instances in monitoring window
      message: 'High number of rate limit violations',
      actions: ['Monitor for potential abuse', 'Review IP patterns'],
    },
    
    // Infrastructure alerts
    memory_usage_high: {
      level: 'warning',
      threshold: 0.85, // 85%
      message: 'Memory usage is high',
      actions: ['Monitor for memory leaks', 'Consider optimization'],
    },
    
    // Wedding day specific alerts
    concurrent_users_high: {
      level: 'info',
      threshold: 50, // 50 concurrent users
      message: 'High concurrent user activity (wedding day traffic)',
      actions: ['Monitor performance closely', 'Be prepared for scaling'],
    },
  },
  endpoints: {
    webhook: process.env.MONITORING_WEBHOOK_URL,
    slack: process.env.SLACK_WEBHOOK_URL,
    email: process.env.ALERT_EMAIL,
    sentry: process.env.VITE_SENTRY_DSN,
  },
};

/**
 * Core Monitoring System
 */
export class WeddingMonitoring {
  private metrics: Map<string, number[]> = new Map();
  private alerts: MetricAlert[] = [];
  private reportingTimer: NodeJS.Timeout | null = null;
  
  constructor() {
    if (MONITORING_CONFIG.enabled) {
      this.startReporting();
      this.setupErrorHandlers();
    }
  }
  
  /**
   * Record a metric value
   */
  recordMetric(name: string, value: number, context?: Record<string, any>): void {
    if (!MONITORING_CONFIG.enabled) return;
    
    const timestamp = Date.now();
    
    // Store metric value
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 values to prevent memory growth
    if (values.length > 100) {
      values.shift();
    }
    
    // Check for alerts
    this.checkAlerts(name, value, context);
    
    // Report to external services
    this.reportMetricExternal(name, value, timestamp, context);
  }
  
  /**
   * Record an event
   */
  recordEvent(event: string, data?: Record<string, any>): void {
    if (!MONITORING_CONFIG.enabled) return;
    
    const eventData = {
      event,
      timestamp: Date.now(),
      data,
    };
    
    // Send to monitoring services
    this.sendToSentry('info', event, eventData);
    
    // Wedding-specific events
    if (event.includes('rsvp')) {
      this.trackRSVPEvent(event, data);
    }
  }
  
  /**
   * Record an error
   */
  recordError(error: Error | string, context?: Record<string, any>): void {
    const errorData = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      timestamp: Date.now(),
      context,
    };
    
    // Add to alerts
    this.alerts.push({
      name: 'application_error',
      value: 1,
      threshold: 1,
      level: 'error',
      timestamp: Date.now(),
      context: errorData,
    });
    
    // Send to external services
    this.sendToSentry('error', errorData.message, errorData);
    this.sendAlert({
      name: 'application_error',
      value: 1,
      threshold: 1,
      level: 'error',
      timestamp: Date.now(),
      context: errorData,
    });
    
    console.error('[MONITORING] Error recorded:', errorData);
  }
  
  /**
   * Get current system health
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: Record<string, any>;
    alerts: MetricAlert[];
    timestamp: number;
  } {
    const criticalAlerts = this.alerts.filter(alert => 
      alert.level === 'critical' && 
      Date.now() - alert.timestamp < 300000 // Last 5 minutes
    );
    
    const errorAlerts = this.alerts.filter(alert => 
      alert.level === 'error' && 
      Date.now() - alert.timestamp < 300000 // Last 5 minutes
    );
    
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (criticalAlerts.length > 0) {
      status = 'unhealthy';
    } else if (errorAlerts.length > 0) {
      status = 'degraded';
    }
    
    // Calculate current metrics
    const currentMetrics: Record<string, any> = {};
    this.metrics.forEach((values, name) => {
      if (values.length > 0) {
        const recent = values.slice(-10); // Last 10 values
        currentMetrics[name] = {
          current: recent[recent.length - 1],
          average: recent.reduce((a, b) => a + b, 0) / recent.length,
          count: values.length,
        };
      }
    });
    
    return {
      status,
      metrics: currentMetrics,
      alerts: this.alerts.slice(-20), // Last 20 alerts
      timestamp: Date.now(),
    };
  }
  
  /**
   * Wedding Day Dashboard Metrics
   */
  getWeddingDayMetrics(): {
    totalRSVPs: number;
    attendingCount: number;
    notAttendingCount: number;
    errorRate: number;
    averageResponseTime: number;
    concurrentUsers: number;
  } {
    const rsvpMetrics = this.metrics.get('rsvp_submissions') || [];
    const errorMetrics = this.metrics.get('rsvp_errors') || [];
    const responseTimeMetrics = this.metrics.get('response_time') || [];
    const concurrentUsers = this.metrics.get('concurrent_users') || [0];
    
    const totalRSVPs = rsvpMetrics.reduce((a, b) => a + b, 0);
    const totalErrors = errorMetrics.reduce((a, b) => a + b, 0);
    const errorRate = totalRSVPs > 0 ? totalErrors / totalRSVPs : 0;
    
    const avgResponseTime = responseTimeMetrics.length > 0 
      ? responseTimeMetrics.reduce((a, b) => a + b, 0) / responseTimeMetrics.length 
      : 0;
    
    return {
      totalRSVPs,
      attendingCount: this.metrics.get('rsvp_attending')?.reduce((a, b) => a + b, 0) || 0,
      notAttendingCount: this.metrics.get('rsvp_not_attending')?.reduce((a, b) => a + b, 0) || 0,
      errorRate: Math.round(errorRate * 100) / 100,
      averageResponseTime: Math.round(avgResponseTime),
      concurrentUsers: concurrentUsers[concurrentUsers.length - 1] || 0,
    };
  }
  
  private checkAlerts(name: string, value: number, context?: Record<string, any>): void {
    const alertConfigs = Object.entries(MONITORING_CONFIG.alerts);
    
    for (const [alertName, config] of alertConfigs) {
      let shouldAlert = false;
      
      // Check if this metric matches alert conditions
      if (alertName.includes(name) || name.includes(alertName.split('_')[0])) {
        if (config.level === 'critical' || config.level === 'error') {
          shouldAlert = value >= config.threshold;
        } else {
          shouldAlert = value > config.threshold;
        }
      }
      
      if (shouldAlert) {
        const alert: MetricAlert = {
          name: alertName,
          value,
          threshold: config.threshold,
          level: config.level,
          timestamp: Date.now(),
          context,
        };
        
        this.alerts.push(alert);
        this.sendAlert(alert);
      }
    }
  }
  
  private async sendAlert(alert: MetricAlert): Promise<void> {
    const config = MONITORING_CONFIG.alerts[alert.name];
    const message = `🚨 ${alert.level.toUpperCase()}: ${config?.message || 'Alert triggered'}\n` +
                   `Metric: ${alert.name}\n` +
                   `Value: ${alert.value}\n` +
                   `Threshold: ${alert.threshold}\n` +
                   `Time: ${new Date(alert.timestamp).toISOString()}\n` +
                   `Actions: ${config?.actions?.join(', ') || 'None specified'}`;
    
    // Send to Slack if configured
    if (MONITORING_CONFIG.endpoints.slack) {
      try {
        await fetch(MONITORING_CONFIG.endpoints.slack, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: message,
            username: 'Wedding RSVP Monitoring',
            icon_emoji: ':wedding:',
          }),
        });
      } catch (error) {
        console.error('Failed to send Slack alert:', error);
      }
    }
    
    // Send to webhook if configured
    if (MONITORING_CONFIG.endpoints.webhook) {
      try {
        await fetch(MONITORING_CONFIG.endpoints.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert),
        });
      } catch (error) {
        console.error('Failed to send webhook alert:', error);
      }
    }
  }
  
  private sendToSentry(level: 'info' | 'warning' | 'error', message: string, extra?: any): void {
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.addBreadcrumb({
        message,
        level,
        timestamp: Date.now() / 1000,
        data: extra,
      });
    }
  }
  
  private reportMetricExternal(name: string, value: number, timestamp: number, context?: any): void {
    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'custom_metric', {
        metric_name: name,
        metric_value: value,
        timestamp,
      });
    }
  }
  
  private trackRSVPEvent(event: string, data?: Record<string, any>): void {
    // Track RSVP-specific metrics
    if (event === 'rsvp_submitted') {
      this.recordMetric('rsvp_submissions', 1);
      if (data?.attending === true) {
        this.recordMetric('rsvp_attending', 1);
      } else {
        this.recordMetric('rsvp_not_attending', 1);
      }
    } else if (event === 'rsvp_error') {
      this.recordMetric('rsvp_errors', 1);
    }
  }
  
  private startReporting(): void {
    this.reportingTimer = setInterval(() => {
      this.generatePeriodicReport();
    }, MONITORING_CONFIG.reportingInterval);
  }
  
  private generatePeriodicReport(): void {
    const healthStatus = this.getHealthStatus();
    const weddingMetrics = this.getWeddingDayMetrics();
    
    // Log summary
    console.log('[MONITORING] Periodic Report:', {
      status: healthStatus.status,
      rsvps: weddingMetrics.totalRSVPs,
      errors: weddingMetrics.errorRate,
      responseTime: weddingMetrics.averageResponseTime,
    });
    
    // Send summary to external services if needed
    if (healthStatus.status !== 'healthy') {
      this.sendAlert({
        name: 'system_health',
        value: healthStatus.status === 'unhealthy' ? 2 : 1,
        threshold: 0,
        level: healthStatus.status === 'unhealthy' ? 'critical' : 'warning',
        timestamp: Date.now(),
        context: { healthStatus, weddingMetrics },
      });
    }
  }
  
  private setupErrorHandlers(): void {
    // Global error handler
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.recordError(event.error || event.message, {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        this.recordError(`Unhandled Promise Rejection: ${event.reason}`, {
          promise: event.promise,
        });
      });
    }
  }
  
  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.reportingTimer) {
      clearInterval(this.reportingTimer);
      this.reportingTimer = null;
    }
  }
}

// Singleton instance
export const weddingMonitoring = new WeddingMonitoring();

/**
 * Convenience functions for common monitoring tasks
 */
export const monitoring = {
  // Performance monitoring
  recordResponseTime: (time: number, endpoint?: string) => {
    weddingMonitoring.recordMetric('response_time', time, { endpoint });
  },
  
  // RSVP monitoring
  recordRSVPSubmission: (attending: boolean, success: boolean = true) => {
    weddingMonitoring.recordEvent('rsvp_submitted', { attending, success });
    if (!success) {
      weddingMonitoring.recordEvent('rsvp_error');
    }
  },
  
  // Security monitoring
  recordSecurityEvent: (event: string, severity: 'low' | 'medium' | 'high', details?: any) => {
    weddingMonitoring.recordEvent(`security_${event}`, { severity, ...details });
    if (severity === 'high') {
      weddingMonitoring.recordError(`Security Event: ${event}`, details);
    }
  },
  
  // User activity
  recordUserActivity: (action: string, userId?: string) => {
    weddingMonitoring.recordEvent('user_activity', { action, userId, timestamp: Date.now() });
  },
  
  // Email monitoring
  recordEmailEvent: (event: 'sent' | 'failed' | 'bounced', recipient?: string) => {
    weddingMonitoring.recordMetric(`email_${event}`, 1, { recipient });
  },
  
  // Database monitoring
  recordDatabaseQuery: (duration: number, query?: string) => {
    weddingMonitoring.recordMetric('db_query_time', duration, { query });
  },
  
  // Error tracking
  recordError: (error: Error | string, context?: any) => {
    weddingMonitoring.recordError(error, context);
  },
  
  // Health checks
  getHealth: () => weddingMonitoring.getHealthStatus(),
  getWeddingMetrics: () => weddingMonitoring.getWeddingDayMetrics(),
};

// Cleanup on application shutdown
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    weddingMonitoring.stop();
  });
}