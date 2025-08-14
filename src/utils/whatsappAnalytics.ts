/**
 * WhatsApp Campaign Analytics Service
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Provides comprehensive analytics tracking for WhatsApp campaigns,
 * including engagement metrics, performance analysis, and reporting.
 */

import { 
  WhatsAppAnalytics, 
  WhatsAppGuest, 
  WhatsAppCampaign, 
  LinkClickEvent,
  WhatsAppLink 
} from '../types/whatsapp';

interface AnalyticsEvent {
  id: string;
  guestId: string;
  campaignId?: string;
  eventType: 'link_generated' | 'message_sent' | 'link_clicked' | 'rsvp_completed' | 'message_delivered' | 'message_read';
  timestamp: Date;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: {
    type: 'mobile' | 'desktop' | 'tablet';
    os: string;
    browser: string;
  };
}

/**
 * WhatsApp Analytics Service
 */
export class WhatsAppAnalyticsService {
  private events: AnalyticsEvent[] = [];
  private clickEvents: LinkClickEvent[] = [];
  private performanceMetrics: Map<string, number> = new Map();

  /**
   * Record a new analytics event
   */
  recordEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): string {
    const analyticsEvent: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      ...event,
    };

    this.events.push(analyticsEvent);
    
    // Update performance metrics
    this.updatePerformanceMetrics(analyticsEvent);
    
    return analyticsEvent.id;
  }

  /**
   * Record link click event with detailed tracking
   */
  recordLinkClick(clickData: {
    guestToken: string;
    guestId: string;
    ipAddress: string;
    userAgent: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
  }): void {
    const clickEvent: LinkClickEvent = {
      id: this.generateEventId(),
      guest_token: clickData.guestToken,
      guest_id: clickData.guestId,
      clicked_at: new Date().toISOString(),
      ip_address: clickData.ipAddress,
      user_agent: clickData.userAgent,
      referrer: clickData.referrer,
      utm_source: clickData.utmSource,
      utm_medium: clickData.utmMedium,
      utm_campaign: clickData.utmCampaign,
      utm_content: clickData.utmContent,
      session_id: this.generateSessionId(),
      is_unique_click: this.isUniqueClick(clickData.guestId, clickData.ipAddress),
    };

    this.clickEvents.push(clickEvent);

    // Record as analytics event too
    this.recordEvent({
      guestId: clickData.guestId,
      eventType: 'link_clicked',
      metadata: {
        userAgent: clickData.userAgent,
        ipAddress: clickData.ipAddress,
        referrer: clickData.referrer,
        utmParams: {
          source: clickData.utmSource,
          medium: clickData.utmMedium,
          campaign: clickData.utmCampaign,
          content: clickData.utmContent,
        },
      },
      ipAddress: clickData.ipAddress,
      userAgent: clickData.userAgent,
      deviceInfo: this.parseDeviceInfo(clickData.userAgent),
    });
  }

  /**
   * Generate comprehensive campaign analytics
   */
  generateCampaignAnalytics(
    campaignId?: string,
    guests: WhatsAppGuest[] = [],
    links: WhatsAppLink[] = []
  ): WhatsAppAnalytics {
    const filteredEvents = campaignId 
      ? this.events.filter(e => e.campaignId === campaignId)
      : this.events;

    const filteredClickEvents = campaignId
      ? this.clickEvents.filter(e => guests.some(g => g.id === e.guest_id))
      : this.clickEvents;

    // Calculate basic metrics
    const totalLinksGenerated = links.length || guests.length;
    const totalMessagesSent = this.countEventsByType(filteredEvents, 'message_sent');
    const totalClicks = filteredClickEvents.length;
    const totalResponses = this.countEventsByType(filteredEvents, 'rsvp_completed');

    // Calculate rates
    const clickThroughRate = totalMessagesSent > 0 ? (totalClicks / totalMessagesSent) * 100 : 0;
    const responseRate = totalClicks > 0 ? (totalResponses / totalClicks) * 100 : 0;
    const bounceRate = this.calculateBounceRate(filteredEvents);
    const averageResponseTime = this.calculateAverageResponseTime(filteredEvents);

    // Generate timeline data
    const dailyStats = this.generateDailyStats(filteredEvents, filteredClickEvents);
    const hourlyActivity = this.generateHourlyActivity(filteredEvents);

    // Analyze geographic distribution
    const countryBreakdown = this.analyzeGeographicDistribution(filteredClickEvents, guests);

    // Platform analysis
    const platformBreakdown = this.analyzePlatformUsage(filteredEvents);

    return {
      campaign_id: campaignId,
      total_links_generated: totalLinksGenerated,
      total_messages_sent: totalMessagesSent,
      total_clicks: totalClicks,
      total_responses: totalResponses,
      click_through_rate: clickThroughRate,
      response_rate: responseRate,
      bounce_rate: bounceRate,
      average_response_time_hours: averageResponseTime,
      daily_stats: dailyStats,
      hourly_activity: hourlyActivity,
      country_breakdown: countryBreakdown,
      platform_breakdown: platformBreakdown,
    };
  }

  /**
   * Generate detailed guest engagement analytics
   */
  generateGuestEngagementAnalytics(guests: WhatsAppGuest[]): Array<{
    guestId: string;
    fullName: string;
    phoneNumber: string;
    messagesSent: number;
    lastRead?: Date;
    lastClicked?: Date;
    rsvpCompleted: boolean;
    rsvpDate?: Date;
    engagementScore: number;
    clickCount: number;
    timeToResponse?: number; // in hours
  }> {
    return guests.map(guest => {
      const guestEvents = this.events.filter(e => e.guestId === guest.id);
      const guestClicks = this.clickEvents.filter(e => e.guest_id === guest.id);
      
      const messagesSent = guestEvents.filter(e => e.eventType === 'message_sent').length;
      const rsvpEvents = guestEvents.filter(e => e.eventType === 'rsvp_completed');
      const clickEvents = guestEvents.filter(e => e.eventType === 'link_clicked');
      
      const lastClicked = clickEvents.length > 0 
        ? new Date(Math.max(...clickEvents.map(e => e.timestamp.getTime())))
        : undefined;
        
      const rsvpCompleted = rsvpEvents.length > 0;
      const rsvpDate = rsvpCompleted ? rsvpEvents[0].timestamp : undefined;
      
      // Calculate engagement score (0-100)
      let engagementScore = 0;
      if (messagesSent > 0) engagementScore += 20;
      if (guestClicks.length > 0) engagementScore += 30;
      if (guestClicks.length > 1) engagementScore += 20;
      if (rsvpCompleted) engagementScore += 30;
      
      // Calculate time to response
      const timeToResponse = this.calculateTimeToResponse(guest.id);

      return {
        guestId: guest.id,
        fullName: guest.guest_name,
        phoneNumber: guest.phone_number,
        messagesSent,
        lastRead: undefined, // Would need WhatsApp Business API for read receipts
        lastClicked,
        rsvpCompleted,
        rsvpDate,
        engagementScore,
        clickCount: guestClicks.length,
        timeToResponse,
      };
    });
  }

  /**
   * Generate performance insights and recommendations
   */
  generatePerformanceInsights(analytics: WhatsAppAnalytics): {
    insights: Array<{
      type: 'success' | 'warning' | 'info';
      title: string;
      description: string;
      recommendation?: string;
    }>;
    benchmarks: {
      clickThroughRate: { current: number; benchmark: number; status: 'above' | 'below' | 'meeting' };
      responseRate: { current: number; benchmark: number; status: 'above' | 'below' | 'meeting' };
      bounceRate: { current: number; benchmark: number; status: 'above' | 'below' | 'meeting' };
    };
  } {
    const insights = [];
    
    // Industry benchmarks for WhatsApp marketing
    const benchmarks = {
      clickThroughRate: { current: analytics.click_through_rate, benchmark: 15, status: 'meeting' as const },
      responseRate: { current: analytics.response_rate, benchmark: 40, status: 'meeting' as const },
      bounceRate: { current: analytics.bounce_rate, benchmark: 30, status: 'meeting' as const },
    };

    // Analyze CTR
    if (analytics.click_through_rate > 20) {
      insights.push({
        type: 'success',
        title: 'Excellent Click-Through Rate',
        description: `Your ${analytics.click_through_rate.toFixed(1)}% CTR is above industry average.`,
        recommendation: 'Keep using similar messaging strategies for future campaigns.',
      });
      benchmarks.clickThroughRate.status = 'above';
    } else if (analytics.click_through_rate < 10) {
      insights.push({
        type: 'warning',
        title: 'Low Click-Through Rate',
        description: `Your ${analytics.click_through_rate.toFixed(1)}% CTR is below industry average.`,
        recommendation: 'Consider testing different message templates or sending times.',
      });
      benchmarks.clickThroughRate.status = 'below';
    }

    // Analyze Response Rate
    if (analytics.response_rate > 50) {
      insights.push({
        type: 'success',
        title: 'Outstanding Response Rate',
        description: `Your ${analytics.response_rate.toFixed(1)}% response rate shows excellent engagement.`,
      });
      benchmarks.responseRate.status = 'above';
    } else if (analytics.response_rate < 25) {
      insights.push({
        type: 'warning',
        title: 'Low Response Rate',
        description: `Your ${analytics.response_rate.toFixed(1)}% response rate could be improved.`,
        recommendation: 'Follow up with non-responders using reminder messages.',
      });
      benchmarks.responseRate.status = 'below';
    }

    // Analyze timing
    const peakHour = analytics.hourly_activity.reduce((max, current) => 
      current.activity_count > max.activity_count ? current : max
    );

    if (peakHour) {
      insights.push({
        type: 'info',
        title: 'Peak Engagement Time',
        description: `Most activity occurs at ${peakHour.hour}:00. Schedule future campaigns around this time.`,
      });
    }

    // Bounce rate analysis
    if (analytics.bounce_rate > 40) {
      insights.push({
        type: 'warning',
        title: 'High Bounce Rate',
        description: `${analytics.bounce_rate.toFixed(1)}% of visitors leave without engaging.`,
        recommendation: 'Review your landing page and RSVP form for usability issues.',
      });
      benchmarks.bounceRate.status = 'above';
    } else if (analytics.bounce_rate < 20) {
      benchmarks.bounceRate.status = 'below';
    }

    return { insights, benchmarks };
  }

  /**
   * Export analytics data for reporting
   */
  exportAnalyticsData(format: 'json' | 'csv' = 'json'): string {
    const data = {
      events: this.events,
      clickEvents: this.clickEvents,
      performanceMetrics: Object.fromEntries(this.performanceMetrics),
      exportedAt: new Date().toISOString(),
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }

    // CSV format
    const csvHeaders = ['Event ID', 'Guest ID', 'Event Type', 'Timestamp', 'IP Address', 'User Agent'];
    const csvRows = this.events.map(event => [
      event.id,
      event.guestId,
      event.eventType,
      event.timestamp.toISOString(),
      event.ipAddress || '',
      event.userAgent || '',
    ]);

    return [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
  }

  /**
   * Get real-time campaign metrics
   */
  getRealTimeMetrics(campaignId?: string): {
    messagesLastHour: number;
    clicksLastHour: number;
    responsesLastHour: number;
    currentEngagementRate: number;
    trendingUp: boolean;
  } {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const filteredEvents = this.events.filter(e => 
      e.timestamp > oneHourAgo && 
      (!campaignId || e.campaignId === campaignId)
    );

    const messagesLastHour = this.countEventsByType(filteredEvents, 'message_sent');
    const clicksLastHour = this.countEventsByType(filteredEvents, 'link_clicked');
    const responsesLastHour = this.countEventsByType(filteredEvents, 'rsvp_completed');

    const currentEngagementRate = messagesLastHour > 0 
      ? (clicksLastHour / messagesLastHour) * 100 
      : 0;

    // Compare with previous hour
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const previousHourEvents = this.events.filter(e => 
      e.timestamp > twoHoursAgo && 
      e.timestamp <= oneHourAgo &&
      (!campaignId || e.campaignId === campaignId)
    );

    const previousHourClicks = this.countEventsByType(previousHourEvents, 'link_clicked');
    const trendingUp = clicksLastHour > previousHourClicks;

    return {
      messagesLastHour,
      clicksLastHour,
      responsesLastHour,
      currentEngagementRate,
      trendingUp,
    };
  }

  // Private helper methods

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isUniqueClick(guestId: string, ipAddress: string): boolean {
    return !this.clickEvents.some(e => 
      e.guest_id === guestId && 
      e.ip_address === ipAddress &&
      new Date(e.clicked_at).getTime() > Date.now() - 30 * 60 * 1000 // Within 30 minutes
    );
  }

  private parseDeviceInfo(userAgent: string): AnalyticsEvent['deviceInfo'] {
    // Simple device detection (in production, use a library like UAParser.js)
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    const isTablet = /iPad|Android.*Tablet/.test(userAgent);
    
    let os = 'Unknown';
    if (/Windows/.test(userAgent)) os = 'Windows';
    else if (/Mac/.test(userAgent)) os = 'macOS';
    else if (/iPhone|iPad/.test(userAgent)) os = 'iOS';
    else if (/Android/.test(userAgent)) os = 'Android';
    else if (/Linux/.test(userAgent)) os = 'Linux';

    let browser = 'Unknown';
    if (/Chrome/.test(userAgent)) browser = 'Chrome';
    else if (/Firefox/.test(userAgent)) browser = 'Firefox';
    else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) browser = 'Safari';
    else if (/Edge/.test(userAgent)) browser = 'Edge';

    return {
      type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
      os,
      browser,
    };
  }

  private countEventsByType(events: AnalyticsEvent[], eventType: string): number {
    return events.filter(e => e.eventType === eventType).length;
  }

  private calculateBounceRate(events: AnalyticsEvent[]): number {
    const clicks = events.filter(e => e.eventType === 'link_clicked');
    const responses = events.filter(e => e.eventType === 'rsvp_completed');
    
    return clicks.length > 0 ? ((clicks.length - responses.length) / clicks.length) * 100 : 0;
  }

  private calculateAverageResponseTime(events: AnalyticsEvent[]): number {
    const responseTimes: number[] = [];
    
    // Group events by guest
    const guestEvents = new Map<string, AnalyticsEvent[]>();
    events.forEach(event => {
      if (!guestEvents.has(event.guestId)) {
        guestEvents.set(event.guestId, []);
      }
      guestEvents.get(event.guestId)!.push(event);
    });

    // Calculate response time for each guest
    guestEvents.forEach((guestEventsList) => {
      const messageSent = guestEventsList.find(e => e.eventType === 'message_sent');
      const rsvpCompleted = guestEventsList.find(e => e.eventType === 'rsvp_completed');
      
      if (messageSent && rsvpCompleted) {
        const responseTime = (rsvpCompleted.timestamp.getTime() - messageSent.timestamp.getTime()) / (1000 * 60 * 60);
        responseTimes.push(responseTime);
      }
    });

    return responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;
  }

  private calculateTimeToResponse(guestId: string): number | undefined {
    const guestEvents = this.events.filter(e => e.guestId === guestId);
    const messageSent = guestEvents.find(e => e.eventType === 'message_sent');
    const rsvpCompleted = guestEvents.find(e => e.eventType === 'rsvp_completed');
    
    if (messageSent && rsvpCompleted) {
      return (rsvpCompleted.timestamp.getTime() - messageSent.timestamp.getTime()) / (1000 * 60 * 60);
    }
    
    return undefined;
  }

  private generateDailyStats(events: AnalyticsEvent[], clickEvents: LinkClickEvent[]): Array<{
    date: string;
    messages_sent: number;
    clicks: number;
    responses: number;
  }> {
    const dailyData = new Map<string, { messages_sent: number; clicks: number; responses: number }>();
    
    // Process analytics events
    events.forEach(event => {
      const date = event.timestamp.toISOString().split('T')[0];
      if (!dailyData.has(date)) {
        dailyData.set(date, { messages_sent: 0, clicks: 0, responses: 0 });
      }
      
      const data = dailyData.get(date)!;
      if (event.eventType === 'message_sent') data.messages_sent++;
      if (event.eventType === 'rsvp_completed') data.responses++;
    });

    // Process click events
    clickEvents.forEach(clickEvent => {
      const date = clickEvent.clicked_at.split('T')[0];
      if (!dailyData.has(date)) {
        dailyData.set(date, { messages_sent: 0, clicks: 0, responses: 0 });
      }
      dailyData.get(date)!.clicks++;
    });

    return Array.from(dailyData.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private generateHourlyActivity(events: AnalyticsEvent[]): Array<{
    hour: number;
    activity_count: number;
  }> {
    const hourlyData = new Array(24).fill(0);
    
    events.forEach(event => {
      const hour = event.timestamp.getHours();
      hourlyData[hour]++;
    });

    return hourlyData.map((count, hour) => ({ hour, activity_count: count }));
  }

  private analyzeGeographicDistribution(
    clickEvents: LinkClickEvent[], 
    guests: WhatsAppGuest[]
  ): Array<{
    country: string;
    guest_count: number;
    response_rate: number;
  }> {
    // Simple country detection based on phone numbers
    const countryData = new Map<string, { guests: number; responses: number }>();
    
    guests.forEach(guest => {
      const country = this.getCountryFromPhone(guest.phone_number);
      if (!countryData.has(country)) {
        countryData.set(country, { guests: 0, responses: 0 });
      }
      
      const data = countryData.get(country)!;
      data.guests++;
      
      if (guest.rsvp_completed) {
        data.responses++;
      }
    });

    return Array.from(countryData.entries()).map(([country, data]) => ({
      country,
      guest_count: data.guests,
      response_rate: data.guests > 0 ? (data.responses / data.guests) * 100 : 0,
    }));
  }

  private getCountryFromPhone(phoneNumber: string): string {
    if (phoneNumber.startsWith('+27')) return 'South Africa';
    if (phoneNumber.startsWith('+1')) return 'USA/Canada';
    if (phoneNumber.startsWith('+44')) return 'United Kingdom';
    if (phoneNumber.startsWith('+61')) return 'Australia';
    return 'Unknown';
  }

  private analyzePlatformUsage(events: AnalyticsEvent[]): Array<{
    platform: 'whatsapp_web' | 'whatsapp_mobile' | 'unknown';
    count: number;
    percentage: number;
  }> {
    const platformCounts = { whatsapp_web: 0, whatsapp_mobile: 0, unknown: 0 };
    
    events.forEach(event => {
      if (event.deviceInfo) {
        if (event.deviceInfo.type === 'mobile') {
          platformCounts.whatsapp_mobile++;
        } else if (event.deviceInfo.type === 'desktop') {
          platformCounts.whatsapp_web++;
        } else {
          platformCounts.unknown++;
        }
      } else {
        platformCounts.unknown++;
      }
    });

    const total = events.length;
    
    return Object.entries(platformCounts).map(([platform, count]) => ({
      platform: platform as 'whatsapp_web' | 'whatsapp_mobile' | 'unknown',
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }

  private updatePerformanceMetrics(event: AnalyticsEvent): void {
    const key = `${event.eventType}_count`;
    const current = this.performanceMetrics.get(key) || 0;
    this.performanceMetrics.set(key, current + 1);
    
    // Update timestamp
    this.performanceMetrics.set('last_updated', Date.now());
  }
}

// Export default instance
export const whatsappAnalytics = new WhatsAppAnalyticsService();

// Utility functions
export function calculateEngagementScore(
  messagesSent: number,
  clicks: number,
  responses: number
): number {
  let score = 0;
  
  if (messagesSent > 0) score += 25;
  if (clicks > 0) score += 35;
  if (clicks > 1) score += 15;
  if (responses > 0) score += 25;
  
  return Math.min(100, score);
}

export function formatAnalyticsMetric(value: number, type: 'percentage' | 'count' | 'hours'): string {
  switch (type) {
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'count':
      return value.toLocaleString();
    case 'hours':
      return `${value.toFixed(1)}h`;
    default:
      return value.toString();
  }
}

export function getEngagementTrend(
  currentPeriod: number,
  previousPeriod: number
): { value: number; direction: 'up' | 'down' | 'stable'; isPositive: boolean } {
  if (previousPeriod === 0) {
    return { value: 100, direction: 'up', isPositive: true };
  }
  
  const percentChange = ((currentPeriod - previousPeriod) / previousPeriod) * 100;
  const direction = Math.abs(percentChange) < 1 ? 'stable' : percentChange > 0 ? 'up' : 'down';
  const isPositive = percentChange >= 0;
  
  return {
    value: Math.abs(percentChange),
    direction,
    isPositive,
  };
}

export default WhatsAppAnalyticsService;