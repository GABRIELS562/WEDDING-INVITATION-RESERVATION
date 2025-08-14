/**
 * WhatsApp Service Integration
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Main service that integrates all WhatsApp campaign functionality:
 * - Token generation and validation
 * - Link generation and management  
 * - Campaign tracking and analytics
 * - Security and rate limiting
 * - Guest import and management
 * - Backup and recovery
 */

import {
  WhatsAppGuest,
  WhatsAppCampaign,
  WhatsAppTemplate,
  WhatsAppAnalytics,
  WhatsAppLink,
  BulkTokenGeneration,
  GuestImportResult,
  GuestImportData,
  TokenGenerationOptions,
  SecurityValidationResult,
  WhatsAppApiResponse,
} from '../types/whatsapp';

import { WhatsAppLinkGenerator } from '../utils/whatsappLinkGenerator';
import { WhatsAppTemplateEngine } from '../utils/whatsappTemplateEngine';
import { WhatsAppAnalyticsService } from '../utils/whatsappAnalytics';
import { WhatsAppSecurityService } from '../utils/whatsappSecurity';
import { WhatsAppBackupService } from '../utils/whatsappBackupRecovery';
import { generateBulkTokens, validateToken } from '../utils/whatsappTokenGenerator';

/**
 * Main WhatsApp Service Class
 * Provides a unified interface for all WhatsApp campaign functionality
 */
export class WhatsAppService {
  private linkGenerator: WhatsAppLinkGenerator;
  private templateEngine: WhatsAppTemplateEngine;
  private analyticsService: WhatsAppAnalyticsService;
  private securityService: WhatsAppSecurityService;
  private backupService: WhatsAppBackupService;

  // In-memory storage (in production, these would be database connections)
  private guests: Map<string, WhatsAppGuest> = new Map();
  private campaigns: Map<string, WhatsAppCampaign> = new Map();
  private templates: Map<string, WhatsAppTemplate> = new Map();

  constructor() {
    this.linkGenerator = new WhatsAppLinkGenerator();
    this.templateEngine = new WhatsAppTemplateEngine('en');
    this.analyticsService = new WhatsAppAnalyticsService();
    this.securityService = new WhatsAppSecurityService();
    this.backupService = new WhatsAppBackupService();

    this.initializeDefaultTemplates();
    this.initializeDefaultConfiguration();
  }

  /**
   * Initialize default message templates
   */
  private initializeDefaultTemplates(): void {
    const defaultTemplates: WhatsAppTemplate[] = [
      {
        id: 'formal_invitation',
        name: 'Formal Wedding Invitation',
        template_text: `Dear {{guest_name}},\n\nYou are cordially invited to the wedding celebration of Dale & Kirsten.\n\nPlease RSVP by {{rsvp_deadline}} using this secure link:\n{{rsvp_link}}\n\nWe look forward to celebrating with you!\n\nWith love,\nDale & Kirsten 💕`,
        variables: ['guest_name', 'rsvp_deadline', 'rsvp_link'],
        category: 'invitation',
        is_default: true,
        usage_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'casual_invitation',
        name: 'Casual Wedding Invitation',
        template_text: `Hey {{guest_name}}! 👋\n\nDale & Kirsten are getting married and we'd love for you to be there! 💍\n\nPlease RSVP by {{rsvp_deadline}}:\n{{rsvp_link}}\n\nCan't wait to celebrate with you! 🎉`,
        variables: ['guest_name', 'rsvp_deadline', 'rsvp_link'],
        category: 'invitation',
        is_default: false,
        usage_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'reminder',
        name: 'RSVP Reminder',
        template_text: `Hi {{guest_name}},\n\nThis is a friendly reminder about Dale & Kirsten's wedding RSVP.\n\nWe haven't received your response yet. Please RSVP by {{rsvp_deadline}}:\n{{rsvp_link}}\n\nThank you! 💝`,
        variables: ['guest_name', 'rsvp_deadline', 'rsvp_link'],
        category: 'reminder',
        is_default: false,
        usage_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Initialize default configuration
   */
  private initializeDefaultConfiguration(): void {
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
   * Import guests from CSV data with token generation
   */
  async importGuestsWithTokens(
    guestData: GuestImportData[],
    tokenOptions: Partial<TokenGenerationOptions> = {}
  ): Promise<WhatsAppApiResponse<GuestImportResult>> {
    try {
      // Convert import data to partial guest objects
      const guestObjects = guestData.map((data, index) => ({
        id: `import_${Date.now()}_${index}`,
        guest_name: data.guest_name,
        phone_number: data.phone_number,
        has_plus_one: data.has_plus_one || false,
        is_child: data.is_child || false,
        notes: data.notes,
        tags: data.tags || [],
        priority: data.priority || 'normal',
      }));

      // Generate bulk tokens and links
      const linkResult = await this.linkGenerator.generateBulkLinks(
        guestObjects,
        tokenOptions,
        'INVITATION'
      );

      if (linkResult.errorCount > 0) {
        console.warn(`Generated links with ${linkResult.errorCount} errors:`, linkResult.errors);
      }

      // Store guests in our system
      const importedGuests: WhatsAppGuest[] = [];
      linkResult.links.forEach(link => {
        const guestData = guestObjects.find(g => g.id === link.guest_id);
        if (guestData) {
          const guest: WhatsAppGuest = {
            id: link.guest_id,
            guest_name: guestData.guest_name,
            phone_number: guestData.phone_number,
            guest_token: this.extractTokenFromUrl(link.rsvp_url),
            rsvp_url: link.rsvp_url,
            whatsapp_link: link.whatsapp_url,
            has_plus_one: guestData.has_plus_one,
            is_child: guestData.is_child || false,
            created_at: link.created_at,
            updated_at: link.created_at,
            invitation_sent: false,
            reminder_count: 0,
            link_clicked: false,
            click_count: 0,
            rsvp_completed: false,
            phone_valid: true,
            token_expired: false,
            campaign_status: 'pending',
            tags: guestData.tags || [],
            priority: guestData.priority || 'normal',
            notes: guestData.notes,
          };

          this.guests.set(guest.id, guest);
          importedGuests.push(guest);
        }
      });

      // Record analytics event
      importedGuests.forEach(guest => {
        this.analyticsService.recordEvent({
          guestId: guest.id,
          eventType: 'link_generated',
          metadata: {
            tokenGeneration: true,
            bulkImport: true,
            templateUsed: 'INVITATION',
          },
        });
      });

      const result: GuestImportResult = {
        total_processed: guestData.length,
        successful_imports: importedGuests.length,
        failed_imports: linkResult.errorCount,
        duplicate_count: 0, // Could implement duplicate detection
        validation_errors: linkResult.errors.map(error => ({
          row: parseInt(error.guestId) || 0,
          guest_name: error.guestId,
          errors: [error.error],
        })),
        imported_guests: importedGuests,
        batch_id: linkResult.batchId,
      };

      return {
        success: true,
        data: result,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Import failed',
      };
    }
  }

  /**
   * Generate WhatsApp links for specific guests
   */
  async generateWhatsAppLinks(
    guestIds: string[],
    templateId: string = 'formal_invitation'
  ): Promise<WhatsAppApiResponse<WhatsAppLink[]>> {
    try {
      const selectedGuests = guestIds
        .map(id => this.guests.get(id))
        .filter(guest => guest !== undefined) as WhatsAppGuest[];

      if (selectedGuests.length === 0) {
        return {
          success: false,
          error: 'No valid guests found',
        };
      }

      const linkResult = await this.linkGenerator.generateBulkLinks(
        selectedGuests,
        {},
        templateId
      );

      // Update guest records with new links
      linkResult.links.forEach(link => {
        const guest = this.guests.get(link.guest_id);
        if (guest) {
          guest.whatsapp_link = link.whatsapp_url;
          guest.updated_at = new Date().toISOString();
        }
      });

      return {
        success: true,
        data: linkResult.links,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Link generation failed',
      };
    }
  }

  /**
   * Validate guest token with security checks
   */
  async validateGuestToken(
    token: string,
    ipAddress: string,
    userAgent: string,
    origin?: string
  ): Promise<SecurityValidationResult> {
    // Security validation first
    const securityResult = await this.securityService.validateTokenSecurity(
      token,
      ipAddress,
      userAgent,
      origin
    );

    if (!securityResult.isValid) {
      return securityResult;
    }

    // Find guest by token
    const guest = Array.from(this.guests.values()).find(g => g.guest_token === token);
    
    if (!guest) {
      return {
        isValid: false,
        error: 'Invalid token',
        securityFlags: {
          rateLimited: false,
          suspiciousActivity: false,
          ipBlocked: false,
          tokenExpired: false,
          tokenReused: false,
        },
      };
    }

    // Additional token validation
    const tokenValidation = await this.securityService.validateGuestToken(
      token,
      guest,
      ipAddress
    );

    if (tokenValidation.isValid) {
      // Record successful access
      this.analyticsService.recordEvent({
        guestId: guest.id,
        eventType: 'link_clicked',
        metadata: {
          ipAddress,
          userAgent,
          tokenValidation: true,
        },
        ipAddress,
        userAgent,
      });
    }

    return {
      isValid: tokenValidation.isValid,
      guest: tokenValidation.guest,
      error: tokenValidation.error,
      securityFlags: tokenValidation.securityFlags,
    };
  }

  /**
   * Create a new WhatsApp campaign
   */
  async createCampaign(
    campaignData: Omit<WhatsAppCampaign, 'id' | 'created_at' | 'send_started_at' | 'send_completed_at'>
  ): Promise<WhatsAppApiResponse<WhatsAppCampaign>> {
    try {
      const campaign: WhatsAppCampaign = {
        ...campaignData,
        id: this.generateCampaignId(),
        created_at: new Date().toISOString(),
        sent_count: 0,
        delivered_count: 0,
        clicked_count: 0,
        responded_count: 0,
        error_count: 0,
      };

      this.campaigns.set(campaign.id, campaign);

      return {
        success: true,
        data: campaign,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Campaign creation failed',
      };
    }
  }

  /**
   * Get all WhatsApp guests
   */
  async getWhatsAppGuests(): Promise<WhatsAppApiResponse<WhatsAppGuest[]>> {
    try {
      const guests = Array.from(this.guests.values());
      return {
        success: true,
        data: guests,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch guests',
      };
    }
  }

  /**
   * Get campaign analytics
   */
  async getCampaignAnalytics(campaignId?: string): Promise<WhatsAppApiResponse<WhatsAppAnalytics>> {
    try {
      const guests = Array.from(this.guests.values());
      const links = this.linkGenerator.getAllLinks();
      
      const analytics = this.analyticsService.generateCampaignAnalytics(
        campaignId,
        guests,
        links
      );

      return {
        success: true,
        data: analytics,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Analytics generation failed',
      };
    }
  }

  /**
   * Get available message templates
   */
  getMessageTemplates(): WhatsAppTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Create or update a message template
   */
  async saveMessageTemplate(
    template: Omit<WhatsAppTemplate, 'created_at' | 'updated_at'>
  ): Promise<WhatsAppApiResponse<WhatsAppTemplate>> {
    try {
      const now = new Date().toISOString();
      const existingTemplate = this.templates.get(template.id);

      const fullTemplate: WhatsAppTemplate = {
        ...template,
        created_at: existingTemplate?.created_at || now,
        updated_at: now,
      };

      this.templates.set(template.id, fullTemplate);

      return {
        success: true,
        data: fullTemplate,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Template save failed',
      };
    }
  }

  /**
   * Record RSVP completion
   */
  async recordRSVPCompletion(
    token: string,
    ipAddress: string,
    userAgent: string
  ): Promise<WhatsAppApiResponse<boolean>> {
    try {
      const guest = Array.from(this.guests.values()).find(g => g.guest_token === token);
      
      if (!guest) {
        return {
          success: false,
          error: 'Guest not found',
        };
      }

      // Update guest record
      guest.rsvp_completed = true;
      guest.rsvp_completed_at = new Date().toISOString();
      guest.campaign_status = 'responded';
      guest.updated_at = new Date().toISOString();

      // Record analytics
      this.analyticsService.recordEvent({
        guestId: guest.id,
        eventType: 'rsvp_completed',
        metadata: {
          completionTime: new Date().toISOString(),
          ipAddress,
          userAgent,
        },
        ipAddress,
        userAgent,
      });

      return {
        success: true,
        data: true,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to record RSVP completion',
      };
    }
  }

  /**
   * Create system backup
   */
  async createSystemBackup(): Promise<WhatsAppApiResponse<{ backupId: string; size: number }>> {
    try {
      const backupData = {
        guests: Array.from(this.guests.values()),
        campaigns: Array.from(this.campaigns.values()),
        templates: Array.from(this.templates.values()),
        analytics: [await this.getCampaignAnalytics().then(r => r.data)].filter(Boolean),
        configurations: this.getSystemConfiguration(),
      };

      const backup = await this.backupService.createBackup(backupData, {
        encrypt: true,
        compress: true,
        createdBy: 'system',
      });

      return {
        success: true,
        data: {
          backupId: backup.backupId,
          size: backup.size,
        },
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Backup creation failed',
      };
    }
  }

  /**
   * Get security analytics
   */
  getSecurityAnalytics(timeframe: number = 24) {
    return this.securityService.getSecurityAnalytics(timeframe);
  }

  /**
   * Clean up system data
   */
  async cleanup(): Promise<{
    securityCleanup: boolean;
    expiredBackups: number;
    errors: string[];
  }> {
    const errors: string[] = [];

    try {
      // Security cleanup
      this.securityService.cleanup();

      // Backup cleanup
      const backupCleanup = this.backupService.cleanupExpiredBackups(30);

      return {
        securityCleanup: true,
        expiredBackups: backupCleanup.deletedCount,
        errors,
      };

    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown cleanup error');
      return {
        securityCleanup: false,
        expiredBackups: 0,
        errors,
      };
    }
  }

  // Private helper methods

  private extractTokenFromUrl(url: string): string {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('token') || '';
  }

  private generateCampaignId(): string {
    return `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSystemConfiguration(): Record<string, any> {
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      features: {
        tokenGeneration: true,
        linkGeneration: true,
        analytics: true,
        security: true,
        backup: true,
      },
      settings: {
        defaultTokenLength: 12,
        defaultExpiry: 60,
        encryptBackups: true,
        enableAnalytics: true,
      },
    };
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();

// Export utility functions
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Ensure it starts with country code
  if (cleaned.startsWith('+27')) {
    return cleaned;
  } else if (cleaned.startsWith('27')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+27' + cleaned.substring(1);
  }
  
  return '+27' + cleaned;
}

export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = formatPhoneNumber(phoneNumber).replace('+', '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function validateGuestData(guest: Partial<WhatsAppGuest>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!guest.guest_name?.trim()) {
    errors.push('Guest name is required');
  }

  if (!guest.phone_number?.trim()) {
    errors.push('Phone number is required');
  } else {
    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = guest.phone_number.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errors.push('Invalid phone number format');
    }
  }

  if (guest.email_address && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email_address)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default WhatsAppService;