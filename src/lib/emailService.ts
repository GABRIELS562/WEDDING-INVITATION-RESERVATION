/**
 * Enterprise-Grade EmailJS Service for Wedding RSVP System
 * Dale & Kirsten's Wedding - October 31st, 2025
 * 
 * Features:
 * - Retry logic with exponential backoff
 * - Email queue with rate limiting
 * - Comprehensive error handling
 * - Template engine with wedding theme
 * - Supabase integration for tracking
 * - Development/production modes
 */

import emailjs from '@emailjs/browser';
import { 
  RSVPSubmissionPayload, 
  ApiResponse, 
  RSVPError, 
  RSVPErrorCode 
} from '@/types/rsvp';
import { markEmailConfirmationSent } from './supabase';

// EmailJS Configuration
interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  fromEmail: string;
  fromName: string;
  isDevelopment: boolean;
}

// Email template data interface
interface EmailTemplateData {
  guest_name: string;
  guest_email: string;
  attending_status: string;
  meal_choice?: string;
  dietary_restrictions?: string;
  wedding_date: string;
  wedding_time: string;
  venue_name: string;
  venue_address: string;
  couple_names: string;
  rsvp_deadline: string;
  contact_email: string;
  website_url: string;
  submission_id: string;
  formatted_date: string;
  confirmation_message: string;
}

// Email queue item
interface EmailQueueItem {
  id: string;
  templateData: EmailTemplateData;
  priority: 'high' | 'normal' | 'low';
  attempts: number;
  maxAttempts: number;
  scheduledFor: number;
  createdAt: number;
  guestToken: string;
}

// Email service response
interface EmailServiceResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  code?: string;
  retryAfter?: number;
  queuePosition?: number;
}

// Rate limiting configuration
interface RateLimitConfig {
  maxEmailsPerMinute: number;
  maxEmailsPerHour: number;
  burstLimit: number;
  cooldownPeriod: number;
}

/**
 * Email Service Class with Enterprise Features
 */
class EmailService {
  private config: EmailConfig;
  private rateLimitConfig: RateLimitConfig;
  private emailQueue: EmailQueueItem[] = [];
  private isProcessingQueue = false;
  private rateLimitTracker = {
    emailsThisMinute: 0,
    emailsThisHour: 0,
    lastMinuteReset: Date.now(),
    lastHourReset: Date.now(),
    burstCount: 0,
    lastBurstReset: Date.now()
  };

  constructor() {
    this.config = {
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
      fromEmail: 'kirstendale583@gmail.com',
      fromName: 'Dale & Kirsten Wedding',
      isDevelopment: process.env.NODE_ENV === 'development'
    };

    this.rateLimitConfig = {
      maxEmailsPerMinute: this.config.isDevelopment ? 2 : 10,
      maxEmailsPerHour: this.config.isDevelopment ? 5 : 200,
      burstLimit: 3,
      cooldownPeriod: 60000 // 1 minute
    };

    // Validate configuration
    this.validateConfiguration();

    // Initialize EmailJS
    if (typeof window !== 'undefined' && this.config.publicKey) {
      emailjs.init(this.config.publicKey);
    }

    // Start queue processor
    this.startQueueProcessor();
  }

  /**
   * Validate EmailJS configuration
   */
  private validateConfiguration(): void {
    const required = ['serviceId', 'templateId', 'publicKey'];
    const missing = required.filter(key => !this.config[key as keyof EmailConfig]);
    
    if (missing.length > 0) {
      console.warn(`EmailJS configuration missing: ${missing.join(', ')}`);
      if (!this.config.isDevelopment) {
        throw new Error(`EmailJS configuration incomplete. Missing: ${missing.join(', ')}`);
      }
    }
  }

  /**
   * Send RSVP confirmation email with comprehensive error handling
   */
  async sendRSVPConfirmation(
    rsvpData: RSVPSubmissionPayload,
    submissionId: string
  ): Promise<EmailServiceResponse> {
    try {
      // Validate email address
      if (!rsvpData.email_address) {
        throw new RSVPError(
          RSVPErrorCode.VALIDATION_ERROR,
          'Email address is required for confirmation'
        );
      }

      if (!this.isValidEmail(rsvpData.email_address)) {
        throw new RSVPError(
          RSVPErrorCode.VALIDATION_ERROR,
          'Invalid email address format'
        );
      }

      // Prepare template data
      const templateData = this.prepareTemplateData(rsvpData, submissionId);

      // Add to email queue
      const queueItem: EmailQueueItem = {
        id: this.generateEmailId(),
        templateData,
        priority: 'high',
        attempts: 0,
        maxAttempts: 3,
        scheduledFor: Date.now(),
        createdAt: Date.now(),
        guestToken: rsvpData.guest_token
      };

      // Check rate limits
      const rateLimitCheck = this.checkRateLimit();
      if (!rateLimitCheck.allowed) {
        queueItem.scheduledFor = Date.now() + rateLimitCheck.retryAfter!;
        this.emailQueue.push(queueItem);
        
        return {
          success: true,
          queuePosition: this.emailQueue.length,
          retryAfter: rateLimitCheck.retryAfter
        };
      }

      // Add to high-priority queue
      this.emailQueue.unshift(queueItem);

      // Process immediately if possible
      if (!this.isProcessingQueue) {
        this.processEmailQueue();
      }

      return {
        success: true,
        queuePosition: 1
      };

    } catch (error) {
      console.error('Email service error:', error);
      
      if (error instanceof RSVPError) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      return {
        success: false,
        error: 'Failed to queue email for sending',
        code: RSVPErrorCode.SERVER_ERROR
      };
    }
  }

  /**
   * Process email queue with retry logic and rate limiting
   */
  private async processEmailQueue(): Promise<void> {
    if (this.isProcessingQueue || this.emailQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      while (this.emailQueue.length > 0) {
        const now = Date.now();
        
        // Find next item ready to send
        const readyItemIndex = this.emailQueue.findIndex(
          item => item.scheduledFor <= now
        );

        if (readyItemIndex === -1) {
          // No items ready, schedule next check
          const nextScheduled = Math.min(...this.emailQueue.map(item => item.scheduledFor));
          setTimeout(() => this.processEmailQueue(), nextScheduled - now);
          break;
        }

        // Get the item and remove from queue
        const item = this.emailQueue.splice(readyItemIndex, 1)[0];

        // Check rate limits
        const rateLimitCheck = this.checkRateLimit();
        if (!rateLimitCheck.allowed) {
          // Re-queue with delay
          item.scheduledFor = now + rateLimitCheck.retryAfter!;
          this.emailQueue.push(item);
          setTimeout(() => this.processEmailQueue(), rateLimitCheck.retryAfter);
          break;
        }

        // Attempt to send email
        const sendResult = await this.sendEmailWithRetry(item);
        
        if (sendResult.success) {
          // Update Supabase on successful send
          try {
            await markEmailConfirmationSent(item.guestToken);
          } catch (dbError) {
            console.error('Failed to update email confirmation status:', dbError);
            // Don't fail the email send for database issues
          }

          // Track successful send
          this.trackEmailSent();
          
          // Log success
          console.log(`✅ Email sent successfully to ${item.templateData.guest_email}`);
          
          // Track analytics
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'email_sent', {
              event_category: 'communication',
              event_label: 'rsvp_confirmation',
              value: 1
            });
          }
        } else {
          // Handle failed send
          item.attempts++;
          
          if (item.attempts < item.maxAttempts) {
            // Re-queue with exponential backoff
            const backoffDelay = Math.min(
              1000 * Math.pow(2, item.attempts), // Exponential backoff
              300000 // Max 5 minutes
            );
            
            item.scheduledFor = now + backoffDelay;
            this.emailQueue.push(item);
            
            console.warn(`⚠️ Email failed, retrying in ${backoffDelay}ms (attempt ${item.attempts}/${item.maxAttempts})`);
          } else {
            // Max attempts reached, log error
            console.error(`❌ Email failed permanently after ${item.maxAttempts} attempts:`, sendResult.error);
            
            // Track failed email
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'email_failed', {
                event_category: 'error',
                event_label: 'rsvp_confirmation',
                value: 1,
                custom_map: {
                  error_code: sendResult.code || 'unknown'
                }
              });
            }
          }
        }

        // Small delay between sends to respect rate limits
        await this.delay(100);
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Send email with retry logic
   */
  private async sendEmailWithRetry(item: EmailQueueItem): Promise<EmailServiceResponse> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // In development mode, simulate email sending
        if (this.config.isDevelopment) {
          return this.simulateEmailSend(item.templateData);
        }

        // Send actual email
        const result = await emailjs.send(
          this.config.serviceId,
          this.config.templateId,
          this.convertTemplateDataForEmailJS(item.templateData),
          this.config.publicKey
        );

        return {
          success: true,
          messageId: result.text
        };

      } catch (error: any) {
        lastError = error;
        
        // Check if it's a retryable error
        if (!this.isRetryableError(error)) {
          break;
        }

        // Wait before retry with jitter
        if (attempt < maxRetries) {
          const delay = (1000 * attempt) + Math.random() * 1000;
          await this.delay(delay);
        }
      }
    }

    // All retries failed
    return {
      success: false,
      error: this.getErrorMessage(lastError),
      code: this.getErrorCode(lastError)
    };
  }

  /**
   * Prepare template data for email rendering
   */
  private prepareTemplateData(
    rsvpData: RSVPSubmissionPayload,
    submissionId: string
  ): EmailTemplateData {
    const weddingDate = new Date('2025-10-31T16:00:00+02:00');
    
    return {
      guest_name: rsvpData.guest_name,
      guest_email: rsvpData.email_address || '',
      attending_status: rsvpData.attending ? 'attending' : 'not attending',
      meal_choice: rsvpData.meal_choice,
      dietary_restrictions: rsvpData.dietary_restrictions,
      wedding_date: 'October 31st, 2025',
      wedding_time: '4:00 PM',
      venue_name: 'Cape Point Vineyards',
      venue_address: 'Silvermine Road, Noordhoek, Cape Town',
      couple_names: 'Dale & Kirsten',
      rsvp_deadline: 'September 30th, 2025',
      contact_email: 'kirstendale583@gmail.com',
      website_url: 'https://kirstendale.com',
      submission_id: submissionId,
      formatted_date: weddingDate.toLocaleDateString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Africa/Johannesburg'
      }),
      confirmation_message: this.generateConfirmationMessage(rsvpData)
    };
  }

  /**
   * Generate personalized confirmation message
   */
  private generateConfirmationMessage(rsvpData: RSVPSubmissionPayload): string {
    if (rsvpData.attending) {
      const mealText = rsvpData.meal_choice ? ` with ${rsvpData.meal_choice}` : '';
      const dietaryText = rsvpData.dietary_restrictions 
        ? `. We've noted your dietary requirements: ${rsvpData.dietary_restrictions}` 
        : '';
      
      return `We're thrilled that you'll be joining us for our special day${mealText}${dietaryText}. We can't wait to celebrate with you!`;
    } else {
      return `Thank you for letting us know you won't be able to attend. We'll miss you on our special day, but we understand. We hope to celebrate with you soon!`;
    }
  }

  /**
   * Convert template data for EmailJS format
   */
  private convertTemplateDataForEmailJS(templateData: EmailTemplateData): Record<string, any> {
    return {
      to_email: templateData.guest_email,
      to_name: templateData.guest_name,
      from_email: this.config.fromEmail,
      from_name: this.config.fromName,
      subject: 'RSVP Confirmation - Dale & Kirsten\'s Wedding',
      guest_name: templateData.guest_name,
      attending_status: templateData.attending_status,
      meal_choice: templateData.meal_choice || 'Not specified',
      dietary_restrictions: templateData.dietary_restrictions || 'None specified',
      wedding_date: templateData.wedding_date,
      wedding_time: templateData.wedding_time,
      venue_name: templateData.venue_name,
      venue_address: templateData.venue_address,
      couple_names: templateData.couple_names,
      rsvp_deadline: templateData.rsvp_deadline,
      contact_email: templateData.contact_email,
      website_url: templateData.website_url,
      submission_id: templateData.submission_id,
      formatted_date: templateData.formatted_date,
      confirmation_message: templateData.confirmation_message,
      year: new Date().getFullYear()
    };
  }

  /**
   * Simulate email sending for development
   */
  private async simulateEmailSend(templateData: EmailTemplateData): Promise<EmailServiceResponse> {
    // Simulate network delay
    await this.delay(Math.random() * 2000 + 1000);
    
    // Simulate occasional failures for testing
    if (Math.random() < 0.1) { // 10% failure rate in dev
      throw new Error('Simulated email service failure');
    }

    console.log('📧 [DEV MODE] Email would be sent to:', templateData.guest_email);
    console.log('📧 [DEV MODE] Email content:', {
      subject: 'RSVP Confirmation - Dale & Kirsten\'s Wedding',
      guest: templateData.guest_name,
      attending: templateData.attending_status,
      meal: templateData.meal_choice
    });

    return {
      success: true,
      messageId: `dev_${Date.now()}_${Math.random().toString(36).substring(7)}`
    };
  }

  /**
   * Rate limiting logic
   */
  private checkRateLimit(): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();

    // Reset counters if needed
    if (now - this.rateLimitTracker.lastMinuteReset > 60000) {
      this.rateLimitTracker.emailsThisMinute = 0;
      this.rateLimitTracker.lastMinuteReset = now;
    }

    if (now - this.rateLimitTracker.lastHourReset > 3600000) {
      this.rateLimitTracker.emailsThisHour = 0;
      this.rateLimitTracker.lastHourReset = now;
    }

    if (now - this.rateLimitTracker.lastBurstReset > this.rateLimitConfig.cooldownPeriod) {
      this.rateLimitTracker.burstCount = 0;
      this.rateLimitTracker.lastBurstReset = now;
    }

    // Check limits
    if (this.rateLimitTracker.emailsThisMinute >= this.rateLimitConfig.maxEmailsPerMinute) {
      return { 
        allowed: false, 
        retryAfter: 60000 - (now - this.rateLimitTracker.lastMinuteReset)
      };
    }

    if (this.rateLimitTracker.emailsThisHour >= this.rateLimitConfig.maxEmailsPerHour) {
      return { 
        allowed: false, 
        retryAfter: 3600000 - (now - this.rateLimitTracker.lastHourReset)
      };
    }

    if (this.rateLimitTracker.burstCount >= this.rateLimitConfig.burstLimit) {
      return { 
        allowed: false, 
        retryAfter: this.rateLimitConfig.cooldownPeriod - (now - this.rateLimitTracker.lastBurstReset)
      };
    }

    return { allowed: true };
  }

  /**
   * Track successful email send
   */
  private trackEmailSent(): void {
    this.rateLimitTracker.emailsThisMinute++;
    this.rateLimitTracker.emailsThisHour++;
    this.rateLimitTracker.burstCount++;
  }

  /**
   * Start queue processor
   */
  private startQueueProcessor(): void {
    // Process queue every 5 seconds
    setInterval(() => {
      if (!this.isProcessingQueue && this.emailQueue.length > 0) {
        this.processEmailQueue();
      }
    }, 5000);
  }

  /**
   * Utility functions
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isRetryableError(error: any): boolean {
    // Network errors, timeouts, and server errors are retryable
    if (error?.name === 'NetworkError') return true;
    if (error?.message?.includes('timeout')) return true;
    if (error?.message?.includes('network')) return true;
    if (error?.status >= 500) return true;
    if (error?.status === 429) return true; // Rate limit
    
    return false;
  }

  private getErrorMessage(error: any): string {
    if (error?.message) return error.message;
    if (error?.text) return error.text;
    if (typeof error === 'string') return error;
    return 'Unknown email service error';
  }

  private getErrorCode(error: any): string {
    if (error?.status === 429) return RSVPErrorCode.RATE_LIMITED;
    if (error?.name === 'NetworkError') return RSVPErrorCode.NETWORK_ERROR;
    if (error?.status >= 500) return RSVPErrorCode.SERVER_ERROR;
    if (error?.status === 400) return RSVPErrorCode.VALIDATION_ERROR;
    return RSVPErrorCode.UNKNOWN_ERROR;
  }

  private generateEmailId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Public API methods
   */

  /**
   * Get queue status for monitoring
   */
  getQueueStatus(): {
    queueLength: number;
    isProcessing: boolean;
    rateLimitStatus: typeof this.rateLimitTracker;
  } {
    return {
      queueLength: this.emailQueue.length,
      isProcessing: this.isProcessingQueue,
      rateLimitStatus: { ...this.rateLimitTracker }
    };
  }

  /**
   * Clear email queue (for testing)
   */
  clearQueue(): void {
    this.emailQueue = [];
  }

  /**
   * Test email configuration
   */
  async testConfiguration(): Promise<ApiResponse<boolean>> {
    try {
      if (!this.config.serviceId || !this.config.templateId || !this.config.publicKey) {
        throw new Error('EmailJS configuration incomplete');
      }

      // In development, just validate config
      if (this.config.isDevelopment) {
        return { success: true, data: true };
      }

      // In production, send test email to configured address
      const testResult = await this.sendRSVPConfirmation({
        guest_token: 'TEST_TOKEN',
        guest_name: 'Test Guest',
        email_address: this.config.fromEmail,
        attending: true,
        meal_choice: 'Test Meal',
        wants_email_confirmation: true,
        wants_whatsapp_confirmation: false
      }, 'TEST_SUBMISSION');

      return { success: testResult.success };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Configuration test failed'
      };
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;