/**
 * WhatsApp Campaign Management Service
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Comprehensive service for bulk token generation, link creation, and campaign management
 */

import { createClient } from '@supabase/supabase-js';
import { 
  WhatsAppGuest, 
  WhatsAppLink, 
  WhatsAppCampaign,
  GuestImportData,
  GuestImportResult,
  BulkTokenGeneration,
  TokenGenerationOptions,
  WhatsAppAnalytics,
  WhatsAppApiResponse,
  LinkClickEvent,
  WhatsAppBatchJob
} from '@/types/whatsapp';
import { tokenGenerator } from './tokenGenerator';
import { messageTemplateEngine } from './messageTemplateEngine';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

class WhatsAppService {
  private readonly BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kirstendale.com';
  private readonly BATCH_SIZE = 50;
  
  /**
   * Import guests and generate tokens in bulk
   */
  async importGuestsWithTokens(
    guestsData: GuestImportData[],
    tokenOptions: Partial<TokenGenerationOptions> = {}
  ): Promise<WhatsAppApiResponse<GuestImportResult>> {
    try {
      const batchId = this.generateBatchId();
      const result: GuestImportResult = {
        total_processed: guestsData.length,
        successful_imports: 0,
        failed_imports: 0,
        duplicate_count: 0,
        validation_errors: [],
        imported_guests: [],
        batch_id: batchId
      };

      // Validate guest data
      const validatedGuests = this.validateGuestData(guestsData, result);
      
      if (validatedGuests.length === 0) {
        return {
          success: false,
          error: 'No valid guests to import',
          data: result
        };
      }

      // Generate tokens for all guests
      const tokenGeneration = await tokenGenerator.generateGuestTokens(
        validatedGuests.map((g, index) => ({ id: `temp_${index}`, guest_name: g.guest_name })),
        tokenOptions
      );

      // Create WhatsApp guests with tokens
      for (let i = 0; i < validatedGuests.length; i++) {
        const guestData = validatedGuests[i];
        const tokenData = tokenGeneration[i];
        
        if (!tokenData) {
          result.failed_imports++;
          result.validation_errors.push({
            row: i + 1,
            guest_name: guestData.guest_name,
            errors: ['Failed to generate token']
          });
          continue;
        }

        try {
          // Create guest record
          const guest = await this.createWhatsAppGuest(guestData, tokenData.token, tokenData.backupToken);
          
          if (guest) {
            result.imported_guests.push(guest);
            result.successful_imports++;
          } else {
            result.failed_imports++;
          }
        } catch (error) {
          result.failed_imports++;
          result.validation_errors.push({
            row: i + 1,
            guest_name: guestData.guest_name,
            errors: [error instanceof Error ? error.message : 'Unknown error']
          });
        }
      }

      // Store batch information
      await this.storeBatchInformation(batchId, result);

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('Error importing guests:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to import guests'
      };
    }
  }

  /**
   * Generate WhatsApp links for all guests
   */
  async generateWhatsAppLinks(
    guestIds: string[],
    templateId: string = 'formal_invitation',
    campaignId?: string
  ): Promise<WhatsAppApiResponse<WhatsAppLink[]>> {
    try {
      // Get guests
      const { data: guests, error } = await supabase
        .from('whatsapp_guests')
        .select('*')
        .in('id', guestIds);

      if (error) throw error;

      if (!guests || guests.length === 0) {
        return {
          success: false,
          error: 'No guests found'
        };
      }

      const links: WhatsAppLink[] = [];
      const errors: string[] = [];

      for (const guest of guests) {
        try {
          const link = await this.generateSingleWhatsAppLink(guest, templateId, campaignId);
          links.push(link);
          
          // Update guest record with generated link
          await this.updateGuestLink(guest.id, link);
        } catch (error) {
          errors.push(`Failed to generate link for ${guest.guest_name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return {
        success: true,
        data: links,
        meta: {
          total: guests.length,
          page: 1,
          limit: guests.length,
          hasMore: false
        }
      };

    } catch (error) {
      console.error('Error generating WhatsApp links:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate WhatsApp links'
      };
    }
  }

  /**
   * Create and launch a WhatsApp campaign
   */
  async createCampaign(
    name: string,
    templateId: string,
    guestIds: string[],
    options: {
      send_immediately?: boolean;
      scheduled_send_time?: string;
      reminder_enabled?: boolean;
      reminder_delay_days?: number;
      include_children?: boolean;
      include_plus_ones?: boolean;
    } = {}
  ): Promise<WhatsAppApiResponse<WhatsAppCampaign>> {
    try {
      // Create campaign record
      const campaign: Omit<WhatsAppCampaign, 'id'> = {
        name,
        description: `WhatsApp campaign using template: ${templateId}`,
        message_template: templateId,
        created_at: new Date().toISOString(),
        created_by: 'admin',
        send_immediately: options.send_immediately || false,
        scheduled_send_time: options.scheduled_send_time,
        reminder_enabled: options.reminder_enabled || false,
        reminder_delay_days: options.reminder_delay_days || 7,
        max_reminders: 3,
        include_children: options.include_children || true,
        include_plus_ones: options.include_plus_ones || true,
        target_tags: [],
        exclude_tags: [],
        status: options.send_immediately ? 'sending' : 'scheduled',
        total_recipients: guestIds.length,
        sent_count: 0,
        delivered_count: 0,
        clicked_count: 0,
        responded_count: 0,
        error_count: 0
      };

      const { data: campaignData, error: campaignError } = await supabase
        .from('whatsapp_campaigns')
        .insert(campaign)
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Generate links for campaign
      const linksResult = await this.generateWhatsAppLinks(guestIds, templateId, campaignData.id);

      if (!linksResult.success) {
        throw new Error('Failed to generate WhatsApp links for campaign');
      }

      // If sending immediately, start batch processing
      if (options.send_immediately) {
        await this.processCampaignBatches(campaignData.id, guestIds);
      }

      return {
        success: true,
        data: campaignData as WhatsAppCampaign
      };

    } catch (error) {
      console.error('Error creating campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create campaign'
      };
    }
  }

  /**
   * Get campaign analytics
   */
  async getCampaignAnalytics(campaignId?: string): Promise<WhatsAppApiResponse<WhatsAppAnalytics>> {
    try {
      let query = supabase.from('whatsapp_guests').select('*');
      
      if (campaignId) {
        // Filter by campaign if specified
        query = query.eq('campaign_id', campaignId);
      }

      const { data: guests, error } = await query;

      if (error) throw error;

      if (!guests) {
        return {
          success: false,
          error: 'No data found'
        };
      }

      // Calculate analytics
      const analytics = this.calculateAnalytics(guests, campaignId);

      return {
        success: true,
        data: analytics
      };

    } catch (error) {
      console.error('Error getting analytics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get analytics'
      };
    }
  }

  /**
   * Track link click
   */
  async trackLinkClick(
    guestToken: string,
    clickData: {
      ip_address: string;
      user_agent: string;
      referrer?: string;
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
    }
  ): Promise<WhatsAppApiResponse<void>> {
    try {
      // Get guest by token
      const { data: guest, error: guestError } = await supabase
        .from('whatsapp_guests')
        .select('*')
        .eq('guest_token', guestToken)
        .single();

      if (guestError || !guest) {
        return {
          success: false,
          error: 'Guest not found'
        };
      }

      // Check if this is a unique click
      const { data: existingClicks } = await supabase
        .from('link_clicks')
        .select('id')
        .eq('guest_token', guestToken)
        .eq('ip_address', clickData.ip_address);

      const isUniqueClick = !existingClicks || existingClicks.length === 0;

      // Create click event
      const clickEvent: Omit<LinkClickEvent, 'id'> = {
        guest_token: guestToken,
        guest_id: guest.id,
        clicked_at: new Date().toISOString(),
        ip_address: clickData.ip_address,
        user_agent: clickData.user_agent,
        referrer: clickData.referrer,
        utm_source: clickData.utm_source,
        utm_medium: clickData.utm_medium,
        utm_campaign: clickData.utm_campaign,
        utm_content: guestToken,
        session_id: this.generateSessionId(),
        is_unique_click: isUniqueClick
      };

      const { error: clickError } = await supabase
        .from('link_clicks')
        .insert(clickEvent);

      if (clickError) throw clickError;

      // Update guest record
      const updateData: any = {
        link_clicked: true,
        click_count: guest.click_count + 1,
        updated_at: new Date().toISOString()
      };

      if (!guest.link_clicked_at) {
        updateData.link_clicked_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('whatsapp_guests')
        .update(updateData)
        .eq('guest_token', guestToken);

      if (updateError) throw updateError;

      return { success: true };

    } catch (error) {
      console.error('Error tracking link click:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to track link click'
      };
    }
  }

  /**
   * Get all WhatsApp guests with filters
   */
  async getWhatsAppGuests(
    filters: {
      campaign_status?: string;
      phone_valid?: boolean;
      invitation_sent?: boolean;
      link_clicked?: boolean;
      rsvp_completed?: boolean;
      search?: string;
    } = {},
    page: number = 1,
    limit: number = 50
  ): Promise<WhatsAppApiResponse<WhatsAppGuest[]>> {
    try {
      let query = supabase.from('whatsapp_guests').select('*');

      // Apply filters
      if (filters.campaign_status) {
        query = query.eq('campaign_status', filters.campaign_status);
      }
      if (filters.phone_valid !== undefined) {
        query = query.eq('phone_valid', filters.phone_valid);
      }
      if (filters.invitation_sent !== undefined) {
        query = query.eq('invitation_sent', filters.invitation_sent);
      }
      if (filters.link_clicked !== undefined) {
        query = query.eq('link_clicked', filters.link_clicked);
      }
      if (filters.rsvp_completed !== undefined) {
        query = query.eq('rsvp_completed', filters.rsvp_completed);
      }
      if (filters.search) {
        query = query.or(`guest_name.ilike.%${filters.search}%, phone_number.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: guests, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: guests || [],
        meta: {
          total: count || 0,
          page,
          limit,
          hasMore: (count || 0) > page * limit
        }
      };

    } catch (error) {
      console.error('Error getting WhatsApp guests:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get WhatsApp guests'
      };
    }
  }

  /**
   * Refresh expired tokens
   */
  async refreshExpiredTokens(): Promise<WhatsAppApiResponse<{ refreshed: number; errors: string[] }>> {
    try {
      // Get guests with expired tokens
      const { data: expiredGuests, error } = await supabase
        .from('whatsapp_guests')
        .select('*')
        .eq('token_expired', true);

      if (error) throw error;

      if (!expiredGuests || expiredGuests.length === 0) {
        return {
          success: true,
          data: { refreshed: 0, errors: [] }
        };
      }

      let refreshed = 0;
      const errors: string[] = [];

      for (const guest of expiredGuests) {
        try {
          // Generate new token
          const newTokenData = await tokenGenerator.refreshToken(guest.guest_token);
          
          // Update guest record
          const { error: updateError } = await supabase
            .from('whatsapp_guests')
            .update({
              guest_token: newTokenData.newToken,
              backup_token: newTokenData.backupToken,
              token_expired: false,
              updated_at: new Date().toISOString()
            })
            .eq('id', guest.id);

          if (updateError) throw updateError;

          // Regenerate RSVP URL and WhatsApp link
          await this.updateGuestUrls(guest.id, newTokenData.newToken);
          
          refreshed++;
        } catch (error) {
          errors.push(`Failed to refresh token for ${guest.guest_name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return {
        success: true,
        data: { refreshed, errors }
      };

    } catch (error) {
      console.error('Error refreshing expired tokens:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh expired tokens'
      };
    }
  }

  // Private helper methods

  private validateGuestData(
    guestsData: GuestImportData[], 
    result: GuestImportResult
  ): GuestImportData[] {
    const validated: GuestImportData[] = [];

    guestsData.forEach((guest, index) => {
      const errors: string[] = [];

      // Validate required fields
      if (!guest.guest_name || guest.guest_name.trim().length === 0) {
        errors.push('Guest name is required');
      }

      if (!guest.phone_number || guest.phone_number.trim().length === 0) {
        errors.push('Phone number is required');
      }

      // Validate phone number format
      if (guest.phone_number) {
        const phoneValidation = tokenGenerator.validatePhoneNumber(guest.phone_number);
        if (!phoneValidation.isValid) {
          errors.push(`Invalid phone number: ${phoneValidation.errors.join(', ')}`);
        }
      }

      // Validate email if provided
      if (guest.email_address && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email_address)) {
        errors.push('Invalid email address format');
      }

      if (errors.length > 0) {
        result.validation_errors.push({
          row: index + 1,
          guest_name: guest.guest_name || 'Unknown',
          errors
        });
        result.failed_imports++;
      } else {
        validated.push(guest);
      }
    });

    return validated;
  }

  private async createWhatsAppGuest(
    guestData: GuestImportData,
    token: string,
    backupToken?: string
  ): Promise<WhatsAppGuest | null> {
    try {
      const rsvpUrl = `${this.BASE_URL}/rsvp?token=${token}`;
      
      const guest: Omit<WhatsAppGuest, 'id'> = {
        guest_name: guestData.guest_name,
        phone_number: guestData.phone_number,
        guest_token: token,
        backup_token: backupToken,
        rsvp_url: rsvpUrl,
        whatsapp_link: '', // Will be generated later
        message_preview: '',
        has_plus_one: guestData.has_plus_one || false,
        is_child: guestData.is_child || false,
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
        notes: guestData.notes,
        tags: guestData.tags || [],
        priority: guestData.priority || 'normal'
      };

      const { data, error } = await supabase
        .from('whatsapp_guests')
        .insert(guest)
        .select()
        .single();

      if (error) throw error;

      return data as WhatsAppGuest;

    } catch (error) {
      console.error('Error creating WhatsApp guest:', error);
      return null;
    }
  }

  private async generateSingleWhatsAppLink(
    guest: WhatsAppGuest,
    templateId: string,
    campaignId?: string
  ): Promise<WhatsAppLink> {
    try {
      // Generate message using template engine
      const messageResult = messageTemplateEngine.generateMessage(guest, templateId);
      const linkResult = messageTemplateEngine.generateWhatsAppLink(guest, messageResult.message);

      const link: WhatsAppLink = {
        guest_id: guest.id,
        guest_name: guest.guest_name,
        phone_number: guest.phone_number,
        clean_phone: linkResult.whatsappUrl.match(/wa\.me\/(\d+)/)?.[1] || '',
        whatsapp_url: linkResult.whatsappUrl,
        rsvp_url: guest.rsvp_url,
        message_text: messageResult.message,
        encoded_message: messageResult.encodedMessage,
        link_valid: linkResult.isValidPhone,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
        click_tracking_enabled: true,
        utm_parameters: {
          source: 'whatsapp',
          medium: 'message',
          campaign: campaignId || 'direct',
          content: guest.guest_token
        }
      };

      return link;

    } catch (error) {
      console.error('Error generating single WhatsApp link:', error);
      throw error;
    }
  }

  private async updateGuestLink(guestId: string, link: WhatsAppLink): Promise<void> {
    try {
      const { error } = await supabase
        .from('whatsapp_guests')
        .update({
          whatsapp_link: link.whatsapp_url,
          message_preview: link.message_text,
          updated_at: new Date().toISOString()
        })
        .eq('id', guestId);

      if (error) throw error;

    } catch (error) {
      console.error('Error updating guest link:', error);
      throw error;
    }
  }

  private async updateGuestUrls(guestId: string, newToken: string): Promise<void> {
    try {
      const newRsvpUrl = `${this.BASE_URL}/rsvp?token=${newToken}`;
      
      const { error } = await supabase
        .from('whatsapp_guests')
        .update({
          rsvp_url: newRsvpUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', guestId);

      if (error) throw error;

    } catch (error) {
      console.error('Error updating guest URLs:', error);
      throw error;
    }
  }

  private async processCampaignBatches(campaignId: string, guestIds: string[]): Promise<void> {
    // This would implement batch processing for sending WhatsApp messages
    // For now, we'll just update the campaign status
    try {
      const { error } = await supabase
        .from('whatsapp_campaigns')
        .update({
          status: 'sent',
          send_started_at: new Date().toISOString(),
          send_completed_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      if (error) throw error;

    } catch (error) {
      console.error('Error processing campaign batches:', error);
    }
  }

  private calculateAnalytics(guests: WhatsAppGuest[], campaignId?: string): WhatsAppAnalytics {
    const totalLinks = guests.length;
    const totalClicks = guests.filter(g => g.link_clicked).length;
    const totalResponses = guests.filter(g => g.rsvp_completed).length;
    const totalSent = guests.filter(g => g.invitation_sent).length;

    return {
      campaign_id: campaignId,
      total_links_generated: totalLinks,
      total_messages_sent: totalSent,
      total_clicks: totalClicks,
      total_responses: totalResponses,
      click_through_rate: totalSent > 0 ? (totalClicks / totalSent) * 100 : 0,
      response_rate: totalClicks > 0 ? (totalResponses / totalClicks) * 100 : 0,
      bounce_rate: 0, // Would need additional tracking
      average_response_time_hours: 24, // Would need to calculate from actual data
      daily_stats: [],
      hourly_activity: [],
      country_breakdown: [],
      platform_breakdown: []
    };
  }

  private async storeBatchInformation(batchId: string, result: GuestImportResult): Promise<void> {
    // Store batch information for tracking and recovery
    try {
      const { error } = await supabase
        .from('import_batches')
        .insert({
          batch_id: batchId,
          total_processed: result.total_processed,
          successful_imports: result.successful_imports,
          failed_imports: result.failed_imports,
          created_at: new Date().toISOString(),
          data: JSON.stringify(result)
        });

      if (error) {
        console.error('Error storing batch information:', error);
      }
    } catch (error) {
      console.error('Error storing batch information:', error);
    }
  }

  private generateBatchId(): string {
    return `IMPORT_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
  }

  private generateSessionId(): string {
    return `SESSION_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();
export default whatsappService;