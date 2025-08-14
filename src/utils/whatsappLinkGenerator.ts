/**
 * WhatsApp Link Generator & Management Service
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Provides comprehensive link generation, validation, and management
 * with bulk processing, analytics tracking, and security features.
 */

import { 
  WhatsAppGuest, 
  WhatsAppLink, 
  BulkTokenGeneration, 
  TokenGenerationOptions,
  WhatsAppConfig,
  WHATSAPP_CONFIG
} from '../types/whatsapp';
import { generateSecureToken, generateBulkTokens, generateTokenExpiry } from './whatsappTokenGenerator';
import { WhatsAppTemplateEngine, generateWhatsAppUrl } from './whatsappTemplateEngine';
import { createSecureHash } from './whatsappTokenGenerator';

// Default configuration for WhatsApp links
export const DEFAULT_WHATSAPP_CONFIG: WhatsAppConfig = {
  base_url: process.env.VITE_BASE_URL || 'https://daleandkirsten.com',
  api_version: 'v1',
  rate_limits: {
    messages_per_minute: WHATSAPP_CONFIG.RATE_LIMIT_PER_MINUTE,
    messages_per_hour: WHATSAPP_CONFIG.RATE_LIMIT_PER_HOUR,
    messages_per_day: 2000,
  },
  retry_config: {
    max_attempts: 3,
    initial_delay_ms: 1000,
    max_delay_ms: 10000,
    backoff_multiplier: 2,
  },
  validation: {
    min_phone_length: 10,
    max_phone_length: 15,
    allowed_country_codes: ['+27'], // South African numbers
    blocked_prefixes: ['999', '000', '111'],
  },
};

/**
 * Main WhatsApp Link Generator class
 */
export class WhatsAppLinkGenerator {
  private config: WhatsAppConfig;
  private templateEngine: WhatsAppTemplateEngine;
  private generatedLinks: Map<string, WhatsAppLink> = new Map();

  constructor(config: Partial<WhatsAppConfig> = {}) {
    this.config = { ...DEFAULT_WHATSAPP_CONFIG, ...config };
    this.templateEngine = new WhatsAppTemplateEngine('en');
    
    // Set global template variables
    this.templateEngine.setGlobalVariables({
      rsvp_deadline: 'March 15th, 2024',
      wedding_date: 'April 20th, 2024',
      wedding_venue: 'Cape Point Vista',
      couple_names: 'Dale & Kirsten',
      contact_email: 'rsvp@daleandkirsten.com'
    });
  }

  /**
   * Generate a single WhatsApp link for a guest
   */
  async generateGuestLink(
    guest: Partial<WhatsAppGuest>,
    tokenOptions: Partial<TokenGenerationOptions> = {},
    templateKey: string = 'INVITATION'
  ): Promise<WhatsAppLink> {
    // Validate guest data
    this.validateGuestData(guest);

    // Generate secure token if not provided
    let token = guest.guest_token;
    if (!token) {
      token = generateSecureToken({
        length: 12,
        use_crypto_random: true,
        include_checksum: true,
        ...tokenOptions
      });
    }

    // Create full guest object
    const fullGuest: WhatsAppGuest = {
      id: guest.id || this.generateGuestId(),
      guest_name: guest.guest_name || 'Guest',
      phone_number: this.formatPhoneNumber(guest.phone_number || ''),
      guest_token: token,
      rsvp_url: this.generateRSVPUrl(token),
      whatsapp_link: '',
      has_plus_one: guest.has_plus_one || false,
      is_child: guest.is_child || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      invitation_sent: false,
      reminder_count: 0,
      link_clicked: false,
      click_count: 0,
      rsvp_completed: false,
      phone_valid: true,
      token_expired: false,
      campaign_status: 'pending',
      tags: guest.tags || [],
      priority: guest.priority || 'normal',
    };

    // Generate personalized message
    const messageResult = this.templateEngine.generateMessage(templateKey, fullGuest);

    // Create WhatsApp URL
    const whatsappUrl = generateWhatsAppUrl(fullGuest.phone_number, messageResult.message);

    // Create link object
    const link: WhatsAppLink = {
      guest_id: fullGuest.id,
      guest_name: fullGuest.guest_name,
      phone_number: fullGuest.phone_number,
      clean_phone: this.formatPhoneNumber(fullGuest.phone_number).replace(/[^\d]/g, ''),
      whatsapp_url: whatsappUrl,
      rsvp_url: fullGuest.rsvp_url,
      message_text: messageResult.message,
      encoded_message: messageResult.encodedMessage,
      link_valid: true,
      created_at: new Date().toISOString(),
      expires_at: generateTokenExpiry(60).toISOString(),
      click_tracking_enabled: true,
      utm_parameters: {
        source: 'whatsapp',
        medium: 'social',
        campaign: 'wedding-rsvp',
        content: templateKey.toLowerCase(),
      },
    };

    // Store link for management
    this.generatedLinks.set(fullGuest.id, link);

    return link;
  }

  /**
   * Generate bulk WhatsApp links for multiple guests
   */
  async generateBulkLinks(
    guestData: Array<Partial<WhatsAppGuest>>,
    tokenOptions: Partial<TokenGenerationOptions> = {},
    templateKey: string = 'INVITATION'
  ): Promise<{
    totalProcessed: number;
    successCount: number;
    errorCount: number;
    links: WhatsAppLink[];
    errors: Array<{ guestId: string; error: string }>;
    generationTime: number;
    batchId: string;
  }> {
    const startTime = Date.now();
    const batchId = this.generateBatchId();
    
    const result = {
      totalProcessed: guestData.length,
      successCount: 0,
      errorCount: 0,
      links: [] as WhatsAppLink[],
      errors: [] as Array<{ guestId: string; error: string }>,
      generationTime: 0,
      batchId,
    };

    // Process in batches to avoid memory issues
    const batchSize = 50;
    for (let i = 0; i < guestData.length; i += batchSize) {
      const batch = guestData.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (guest) => {
          try {
            const link = await this.generateGuestLink(guest, tokenOptions, templateKey);
            result.links.push(link);
            result.successCount++;
          } catch (error) {
            result.errors.push({
              guestId: guest.id || `guest-${i}`,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
            result.errorCount++;
          }
        })
      );

      // Small delay between batches to prevent overwhelming the system
      if (i + batchSize < guestData.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    result.generationTime = Date.now() - startTime;
    return result;
  }

  /**
   * Validate guest data before processing
   */
  private validateGuestData(guest: Partial<WhatsAppGuest>): void {
    if (!guest.guest_name || guest.guest_name.trim().length === 0) {
      throw new Error('Guest name is required');
    }

    if (!guest.phone_number || guest.phone_number.trim().length === 0) {
      throw new Error('Phone number is required');
    }

    const phoneValidation = this.validatePhoneNumber(guest.phone_number);
    if (!phoneValidation.isValid) {
      throw new Error(`Invalid phone number: ${phoneValidation.errors.join(', ')}`);
    }
  }

  /**
   * Validate phone number format
   */
  private validatePhoneNumber(phone: string): {
    isValid: boolean;
    formatted: string;
    errors: string[];
  } {
    const errors: string[] = [];
    let formatted = phone.replace(/[^\d+]/g, '');

    // Check length
    if (formatted.length < this.config.validation.min_phone_length) {
      errors.push('Phone number too short');
    }

    if (formatted.length > this.config.validation.max_phone_length) {
      errors.push('Phone number too long');
    }

    // Check for blocked prefixes
    const hasBlockedPrefix = this.config.validation.blocked_prefixes.some(prefix =>
      formatted.includes(prefix)
    );

    if (hasBlockedPrefix) {
      errors.push('Phone number contains blocked prefix');
    }

    // Format South African numbers
    if (!formatted.startsWith('+')) {
      if (formatted.startsWith('27')) {
        formatted = '+' + formatted;
      } else if (formatted.startsWith('0')) {
        formatted = '+27' + formatted.substring(1);
      } else {
        formatted = '+27' + formatted;
      }
    }

    return {
      isValid: errors.length === 0,
      formatted,
      errors,
    };
  }

  /**
   * Format phone number consistently
   */
  private formatPhoneNumber(phone: string): string {
    const validation = this.validatePhoneNumber(phone);
    return validation.formatted;
  }

  /**
   * Generate RSVP URL with token
   */
  private generateRSVPUrl(token: string): string {
    const baseUrl = this.config.base_url.replace(/\/$/, '');
    return `${baseUrl}/rsvp?token=${encodeURIComponent(token)}`;
  }

  /**
   * Generate unique guest ID
   */
  private generateGuestId(): string {
    return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique batch ID
   */
  private generateBatchId(): string {
    const timestamp = Date.now().toString(36);
    const randomId = Math.random().toString(36).substr(2, 9);
    return `batch_${timestamp}_${randomId}`;
  }

  /**
   * Get generated link by guest ID
   */
  getLink(guestId: string): WhatsAppLink | undefined {
    return this.generatedLinks.get(guestId);
  }

  /**
   * Get all generated links
   */
  getAllLinks(): WhatsAppLink[] {
    return Array.from(this.generatedLinks.values());
  }

  /**
   * Update link click tracking
   */
  recordLinkClick(guestId: string, clickData: {
    timestamp: string;
    ipAddress: string;
    userAgent: string;
  }): boolean {
    const link = this.generatedLinks.get(guestId);
    if (!link) {
      return false;
    }

    // Update click tracking (this would typically be stored in database)
    console.log(`Link clicked: ${guestId}`, clickData);
    
    return true;
  }

  /**
   * Regenerate expired or compromised links
   */
  async regenerateLinks(
    guestIds: string[],
    tokenOptions: Partial<TokenGenerationOptions> = {}
  ): Promise<{
    regenerated: number;
    failed: number;
    newLinks: WhatsAppLink[];
    errors: string[];
  }> {
    const result = {
      regenerated: 0,
      failed: 0,
      newLinks: [] as WhatsAppLink[],
      errors: [] as string[],
    };

    for (const guestId of guestIds) {
      try {
        const existingLink = this.generatedLinks.get(guestId);
        if (!existingLink) {
          throw new Error(`Link not found for guest ${guestId}`);
        }

        // Generate new token
        const newToken = generateSecureToken({
          length: 12,
          use_crypto_random: true,
          include_checksum: true,
          ...tokenOptions,
        });

        // Create updated guest data
        const guestData: Partial<WhatsAppGuest> = {
          id: guestId,
          guest_name: existingLink.guest_name,
          phone_number: existingLink.phone_number,
          guest_token: newToken,
        };

        // Generate new link
        const newLink = await this.generateGuestLink(guestData, tokenOptions);
        result.newLinks.push(newLink);
        result.regenerated++;

      } catch (error) {
        result.errors.push(`Failed to regenerate link for ${guestId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        result.failed++;
      }
    }

    return result;
  }

  /**
   * Get link statistics
   */
  getLinkStatistics(): {
    totalLinks: number;
    activeLinks: number;
    expiredLinks: number;
    averageMessageLength: number;
    phoneNumberBreakdown: Record<string, number>;
    templateUsage: Record<string, number>;
  } {
    const links = this.getAllLinks();
    const now = new Date();

    const stats = {
      totalLinks: links.length,
      activeLinks: 0,
      expiredLinks: 0,
      averageMessageLength: 0,
      phoneNumberBreakdown: {} as Record<string, number>,
      templateUsage: {} as Record<string, number>,
    };

    let totalMessageLength = 0;

    links.forEach(link => {
      // Count active vs expired
      if (new Date(link.expires_at) > now) {
        stats.activeLinks++;
      } else {
        stats.expiredLinks++;
      }

      // Message length
      totalMessageLength += link.message_text.length;

      // Phone number country breakdown
      const countryCode = link.phone_number.substring(0, 3);
      stats.phoneNumberBreakdown[countryCode] = (stats.phoneNumberBreakdown[countryCode] || 0) + 1;

      // Template usage (derived from utm_content)
      const template = link.utm_parameters.content || 'unknown';
      stats.templateUsage[template] = (stats.templateUsage[template] || 0) + 1;
    });

    stats.averageMessageLength = links.length > 0 ? Math.round(totalMessageLength / links.length) : 0;

    return stats;
  }

  /**
   * Export links for backup or external use
   */
  exportLinks(format: 'json' | 'csv' = 'json'): string {
    const links = this.getAllLinks();

    if (format === 'csv') {
      const headers = [
        'guest_id', 'guest_name', 'phone_number', 'whatsapp_url', 
        'rsvp_url', 'created_at', 'expires_at'
      ];

      const csvRows = [
        headers.join(','),
        ...links.map(link => [
          link.guest_id,
          `"${link.guest_name}"`,
          link.phone_number,
          `"${link.whatsapp_url}"`,
          `"${link.rsvp_url}"`,
          link.created_at,
          link.expires_at,
        ].join(','))
      ];

      return csvRows.join('\n');
    }

    return JSON.stringify(links, null, 2);
  }

  /**
   * Clean up expired links
   */
  cleanupExpiredLinks(): {
    removedCount: number;
    remainingCount: number;
  } {
    const now = new Date();
    const toRemove: string[] = [];

    this.generatedLinks.forEach((link, guestId) => {
      if (new Date(link.expires_at) < now) {
        toRemove.push(guestId);
      }
    });

    toRemove.forEach(guestId => {
      this.generatedLinks.delete(guestId);
    });

    return {
      removedCount: toRemove.length,
      remainingCount: this.generatedLinks.size,
    };
  }
}

// Export default instance
export const defaultLinkGenerator = new WhatsAppLinkGenerator();

// Utility functions
export function isValidWhatsAppNumber(phone: string): boolean {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15 && (cleaned.startsWith('+') || cleaned.length >= 10);
}

export function extractCountryCode(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+27')) return '+27';
  if (cleaned.startsWith('+1')) return '+1';
  if (cleaned.startsWith('+44')) return '+44';
  return '+27'; // Default to South Africa
}

export function formatMessagePreview(message: string, maxLength: number = 100): string {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength - 3) + '...';
}

export default WhatsAppLinkGenerator;