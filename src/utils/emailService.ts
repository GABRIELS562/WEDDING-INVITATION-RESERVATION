import emailjs from '@emailjs/browser';
import type { EmailJSConfig, RSVPFormData, RSVPSubmission, APIResponse } from '../types';
import { weddingInfo } from '../data/weddingInfo';
import { generateConfirmationHTML, rsvpToConfirmationData } from './pdfGenerator';

interface EmailTemplateData extends Record<string, unknown> {
  // Header Information
  bride_name: string;
  groom_name: string;
  couple_names: string;
  wedding_date: string;
  wedding_time: string;
  
  // Database Column Data (matches exactly)
  timestamp: string; // A1: Timestamp
  guest_token: string; // B1: Guest Token
  guest_name: string; // C1: Guest Name
  attending: string; // D1: Attending (YES/NO)
  meal_choice: string; // E1: Meal Choice
  dietary_restrictions: string; // F1: Dietary Restrictions
  email_address: string; // J1: Email Address
  whatsapp_number: string; // WhatsApp Number
  email_confirmation_sent: string; // K1: Email Confirmation Sent
  submission_id: string; // L1: Submission ID
  
  // Legacy Guest Information (for compatibility)
  to_name: string;
  to_email: string;
  email: string; // Standard EmailJS recipient field
  
  // RSVP Details
  attendance_status: string;
  attendance_message: string;
  
  // Meal Information (conditional)
  show_meal_info: string;
  meal_choice: string;
  dietary_restrictions: string;
  
  // Plus-One Information (conditional)
  show_plus_one: string;
  plus_one_name: string;
  plus_one_meal: string;
  plus_one_dietary: string;
  
  // Special Requests
  special_requests: string;
  
  // Venue Information
  ceremony_venue: string;
  ceremony_address: string;
  reception_venue: string;
  reception_address: string;
  
  // Contact Information
  contact_phone: string;
  contact_email: string;
  
  // Additional Info
  dress_code: string;
  parking_info: string;
  website_url: string;
  hashtag: string;
  
  // Submission Details
  submission_id: string;
  submission_type: string;
}

class EmailService {
  private config: EmailJSConfig;
  private readonly MAX_RETRIES = 2;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor(config: EmailJSConfig) {
    this.config = config;
    
    // Initialize EmailJS with public key if available
    if (this.config.publicKey) {
      try {
        emailjs.init(this.config.publicKey);
        console.log('EmailJS initialized successfully');
      } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
      }
    } else {
      console.warn('EmailJS public key not provided');
    }
  }

  /**
   * Validate EmailJS configuration
   */
  validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.config.serviceId) {
      errors.push('EmailJS Service ID is required');
    }
    
    if (!this.config.templateId) {
      errors.push('EmailJS Template ID is required');
    }
    
    if (!this.config.publicKey) {
      errors.push('EmailJS Public Key is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Send professional RSVP confirmation email with retry logic
   */
  async sendConfirmationEmail(rsvpData: RSVPSubmission): Promise<APIResponse<boolean>> {
    try {
      // Starting email send process
      
      // Validate configuration first
      const configValidation = this.validateConfiguration();
      if (!configValidation.isValid) {
        console.error('EmailJS config validation failed:', configValidation.errors);
        return {
          success: false,
          error: `Email configuration invalid: ${configValidation.errors.join(', ')}`
        };
      }

      // Validate email address
      if (!rsvpData.email || !this.isValidEmail(rsvpData.email)) {
        return {
          success: false,
          error: 'Invalid email address provided'
        };
      }

      // Prepare template data with conditional content
      const templateData = this.prepareTemplateData(rsvpData);
      
      // Send email with retry logic
      const result = await this.sendEmailWithRetry(templateData);
      
      if (result.success) {
        console.log(`Confirmation email sent successfully to ${rsvpData.email}`);
      }
      
      return result;
      
    } catch (error) {
      console.error('Error in sendConfirmationEmail:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected error sending email'
      };
    }
  }

  /**
   * Send RSVP update notification email
   */
  async sendUpdateNotification(rsvpData: RSVPSubmission): Promise<APIResponse<boolean>> {
    try {
      // Prepare template data for update
      const templateData = this.prepareTemplateData(rsvpData, 'update');
      
      // Send email with retry logic
      const result = await this.sendEmailWithRetry(templateData);
      
      if (result.success) {
        console.log(`Update notification sent successfully to ${rsvpData.email}`);
      }
      
      return result;
      
    } catch (error) {
      console.error('Error in sendUpdateNotification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected error sending update email'
      };
    }
  }

  /**
   * Prepare template data to match your EmailJS template exactly
   */
  private prepareTemplateData(rsvpData: RSVPSubmission, submissionType: 'new' | 'update' = 'new'): any {
    const isAttending = rsvpData.isAttending;
    
    // Simple template data matching your EmailJS template exactly
    const templateData = {
      // Core variables from your EmailJS template screenshot
      guest_name: rsvpData.guestName,
      bride_name: 'Kirsten',
      groom_name: 'Dale', 
      email_address: rsvpData.email || 'kirstendale583@gmail.com',
      
      // RSVP details
      attending: isAttending ? 'YES' : 'NO',
      meal_choice: rsvpData.mealChoice || 'Not selected',
      dietary_restrictions: rsvpData.dietaryRestrictions || 'None',
      special_requests: rsvpData.specialRequests || 'None',
      
      // Wedding details
      wedding_date: 'October 31st, 2025'
    };
    
    console.log('🎉 Final template data for EmailJS:', templateData);
    return templateData;
  }
  
  /**
   * OLD complex template data (keeping for reference)
   */
  private prepareComplexTemplateData(rsvpData: RSVPSubmission, submissionType: 'new' | 'update' = 'new'): EmailTemplateData {
    const isAttending = rsvpData.isAttending;
    const hasPlusOne = isAttending && rsvpData.plusOneName && rsvpData.plusOneName.trim() !== '';
    
    return {
      // Match your EmailJS template variables exactly
      guest_name: rsvpData.guestName,
      bride_name: weddingInfo.bride.name,
      groom_name: weddingInfo.groom.name,
      email_address: rsvpData.email || 'jgabriels26@gmail.com',
      
      // Additional template data for compatibility
      couple_names: `${weddingInfo.bride.name} & ${weddingInfo.groom.name}`,
      wedding_date: this.formatWeddingDate(),
      wedding_time: this.formatWeddingTime(),
      
      // Guest Information - Match Database columns exactly
      timestamp: new Date().toISOString(), // A1: Timestamp
      guest_token: rsvpData.token, // B1: Guest Token
      attending: isAttending ? 'YES' : 'NO', // D1: Attending
      meal_choice: rsvpData.mealChoice || '', // E1: Meal Choice
      dietary_restrictions: rsvpData.dietaryRestrictions || '', // F1: Dietary Restrictions
      whatsapp_number: rsvpData.whatsappNumber || '', // WhatsApp Number
      email_confirmation_sent: rsvpData.wantsEmailConfirmation ? 'SENT' : 'NO', // K1: Email Confirmation Sent
      submission_id: this.generateSubmissionId(rsvpData.token), // L1: Submission ID
      
      // Legacy fields for backward compatibility
      to_name: rsvpData.guestName,
      to_email: rsvpData.email || 'kirstendale583@gmail.com',
      email: rsvpData.email || 'kirstendale583@gmail.com', // Standard EmailJS recipient field with fallback
      
      // RSVP Details
      attendance_status: isAttending ? 'attending' : 'not attending',
      attendance_message: this.getAttendanceMessage(isAttending, submissionType),
      
      // Meal Information (conditional)
      show_meal_info: isAttending ? 'yes' : 'no',
      
      // Plus-One Information (conditional)
      show_plus_one: hasPlusOne ? 'yes' : 'no',
      plus_one_name: hasPlusOne ? rsvpData.plusOneName || '' : '',
      plus_one_meal: hasPlusOne ? (rsvpData.plusOneMealChoice || 'Not yet selected') : '',
      plus_one_dietary: hasPlusOne ? (rsvpData.plusOneDietaryRestrictions || 'None specified') : '',
      
      // Special Requests
      special_requests: rsvpData.specialRequests || 'None',
      
      // Venue Information
      ceremony_venue: weddingInfo.venue.ceremony.name,
      ceremony_address: this.formatAddress(weddingInfo.venue.ceremony),
      reception_venue: weddingInfo.venue.reception.name,
      reception_address: this.formatAddress(weddingInfo.venue.reception),
      
      // Contact Information
      contact_phone: weddingInfo.bride.phone || weddingInfo.groom.phone || '',
      contact_email: weddingInfo.bride.email || weddingInfo.groom.email || '',
      
      // Additional Info
      dress_code: weddingInfo.importantInfo?.dressCode || 'Cocktail Attire',
      parking_info: weddingInfo.venue.ceremony.parkingInfo || 'Parking information will be provided closer to the wedding date.',
      website_url: weddingInfo.website || '',
      hashtag: weddingInfo.hashtag || `#${weddingInfo.bride.name}${weddingInfo.groom.name}Wedding`,
      
      // Submission Type
      submission_type: submissionType
    };
  }

  /**
   * Send email with retry logic
   */
  private async sendEmailWithRetry(templateData: EmailTemplateData): Promise<APIResponse<boolean>> {
    let lastError: any;
    
    // Attempting to send email
    
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        // Email send attempt
        // Calling EmailJS API
        
        console.log('📧 EmailJS Configuration:', {
          serviceId: this.config.serviceId,
          templateId: this.config.templateId,
          publicKey: this.config.publicKey || 'MISSING',
          publicKeyLength: this.config.publicKey?.length || 0
        });
        console.log('📧 Template data being sent:', JSON.stringify(templateData, null, 2));
        
        const response = await emailjs.send(
          this.config.serviceId,
          this.config.templateId,
          templateData,
          this.config.publicKey
        );
        
        console.log('📧 EmailJS response:', response);
        
        // EmailJS response received

        if (response.status === 200) {
          return { success: true, data: true };
        } else {
          throw new Error(`EmailJS returned status ${response.status}`);
        }
        
      } catch (error) {
        lastError = error;
        
        // Multiple ways to ensure error is visible
        console.error(`📧 EmailService: Attempt ${attempt} failed with error:`, error);
        console.error(`📧 EmailService: Error message: ${error instanceof Error ? error.message : String(error)}`);
        console.error(`📧 EmailService: Error name: ${error instanceof Error ? error.name : 'Unknown'}`);
        console.log(`🚨 EMAIL ATTEMPT ${attempt} FAILED:`, JSON.stringify(error, null, 2));
        console.warn(`💥 EMAIL ERROR DETAILS:`, {
          message: error instanceof Error ? error.message : 'No message',
          toString: String(error),
          type: typeof error,
          errorObject: error
        });
        
        if (error instanceof Error && error.stack) {
          console.error(`📧 EmailService: Error stack:`, error.stack);
        }
        
        if (attempt < this.MAX_RETRIES) {
          console.log(`📧 EmailService: Retrying in ${this.RETRY_DELAY * attempt}ms...`);
          await this.delay(this.RETRY_DELAY * attempt);
        }
      }
    }
    
    console.error('📧 EmailService: All retry attempts failed. Final error:', lastError);
    
    return {
      success: false,
      error: lastError instanceof Error ? lastError.message : 'Failed to send email after retries'
    };
  }

  /**
   * Test EmailJS connection
   */
  async testConnection(): Promise<APIResponse<boolean>> {
    try {
      // Validate configuration first
      const configValidation = this.validateConfiguration();
      if (!configValidation.isValid) {
        return {
          success: false,
          error: `Configuration invalid: ${configValidation.errors.join(', ')}`
        };
      }

      // Send a simple test email
      const testData = {
        to_name: 'Test User',
        to_email: 'test@example.com',
        test_message: 'EmailJS connection test',
        bride_name: weddingInfo.bride.name,
        groom_name: weddingInfo.groom.name,
        wedding_date: this.formatWeddingDate()
      };

      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        testData
      );

      return { 
        success: response.status === 200, 
        data: response.status === 200 
      };
      
    } catch (error) {
      console.error('EmailJS connection test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed'
      };
    }
  }

  /**
   * Legacy methods for backward compatibility
   */
  async sendRSVPSubmissionConfirmation(rsvpData: RSVPSubmission): Promise<APIResponse<boolean>> {
    return this.sendConfirmationEmail(rsvpData);
  }

  async sendRSVPConfirmation(rsvpData: RSVPFormData, guestName: string): Promise<APIResponse<boolean>> {
    // Convert RSVPFormData to RSVPSubmission for compatibility
    const rsvpSubmission: RSVPSubmission = {
      token: rsvpData.guestToken,
      guestName: guestName,
      email: rsvpData.email,
      isAttending: rsvpData.isAttending,
      mealChoice: rsvpData.mealChoices?.[0]?.mainCourse || undefined,
      dietaryRestrictions: rsvpData.dietaryRestrictions?.join(', ') || undefined,
      plusOneName: rsvpData.guestNames?.[1] || undefined,
      plusOneMealChoice: rsvpData.mealChoices?.[1]?.mainCourse || undefined,
      plusOneDietaryRestrictions: undefined,
      wantsEmailConfirmation: true,
      specialRequests: rsvpData.specialRequests || undefined,
      submittedAt: new Date().toISOString()
    };
    
    return this.sendConfirmationEmail(rsvpSubmission);
  }

  async sendRSVPUpdateNotification(rsvpData: RSVPFormData, guestName: string): Promise<APIResponse<boolean>> {
    // Convert and call update notification
    const rsvpSubmission: RSVPSubmission = {
      token: rsvpData.guestToken,
      guestName: guestName,
      email: rsvpData.email,
      isAttending: rsvpData.isAttending,
      mealChoice: rsvpData.mealChoices?.[0]?.mainCourse || undefined,
      dietaryRestrictions: rsvpData.dietaryRestrictions?.join(', ') || undefined,
      plusOneName: rsvpData.guestNames?.[1] || undefined,
      plusOneMealChoice: rsvpData.mealChoices?.[1]?.mainCourse || undefined,
      plusOneDietaryRestrictions: undefined,
      wantsEmailConfirmation: true,
      specialRequests: rsvpData.specialRequests || undefined,
      submittedAt: new Date().toISOString()
    };
    
    return this.sendUpdateNotification(rsvpSubmission);
  }

  /**
   * Helper methods for email formatting
   */
  private formatWeddingDate(): string {
    return weddingInfo.date.ceremony.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private formatWeddingTime(): string {
    return weddingInfo.date.ceremony.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  private formatAddress(venue: any): string {
    return `${venue.address}, ${venue.city}, ${venue.state} ${venue.zipCode}`;
  }

  private getAttendanceMessage(isAttending: boolean, submissionType: 'new' | 'update'): string {
    if (submissionType === 'update') {
      return isAttending 
        ? "Thank you for updating your RSVP! We're thrilled you'll be celebrating with us."
        : "Thank you for updating your RSVP. We're sorry you can't make it, but we appreciate you letting us know.";
    } else {
      return isAttending 
        ? "Thank you for your RSVP! We're so excited to celebrate with you."
        : "Thank you for your RSVP. We're sorry you can't make it, but we appreciate you letting us know.";
    }
  }

  private generateSubmissionId(token: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${token.substring(0, 6)}-${timestamp}-${random}`.toUpperCase();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Send notification to bride/groom when guest doesn't provide email
   */
  async sendBrideGroomNotification(rsvpData: RSVPSubmission & any): Promise<APIResponse<boolean>> {
    try {
      const configValidation = this.validateConfiguration();
      if (!configValidation.isValid) {
        return {
          success: false,
          error: `Email configuration invalid: ${configValidation.errors.join(', ')}`
        };
      }

      // Match your EmailJS template variables exactly
      const templateData = {
        guest_name: rsvpData.guestName,
        bride_name: weddingInfo.bride.name,
        groom_name: weddingInfo.groom.name,
        email_address: rsvpData.to_email || 'jgabriels26@gmail.com',
        attending: rsvpData.isAttending ? 'YES' : 'NO',
        meal_choice: rsvpData.mealChoice || 'Not selected',
        dietary_restrictions: rsvpData.dietaryRestrictions || 'None',
        special_requests: rsvpData.specialRequests || 'None',
        guest_email_provided: rsvpData.guest_email || 'No email provided',
        notification_type: 'Bride/Groom Notification'
      };

      return await this.sendEmailWithRetry(templateData);
    } catch (error) {
      console.error('Error in sendBrideGroomNotification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send bride/groom notification'
      };
    }
  }
}

export default EmailService;

// Debug environment variables
console.log('🔧 EmailJS Environment Variables:', {
  VITE_EMAILJS_SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  VITE_EMAILJS_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  VITE_EMAILJS_PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  VITE_EMAILJS_PUBLIC_KEY_NEW: import.meta.env.VITE_EMAILJS_PUBLIC_KEY_NEW
});

// Default email service configuration
const defaultEmailConfig: EmailJSConfig = {
  serviceId: (import.meta.env.REACT_APP_EMAILJS_SERVICE_ID || import.meta.env.VITE_EMAILJS_SERVICE_ID || '').trim(),
  templateId: (import.meta.env.REACT_APP_EMAILJS_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID_NEW || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '').trim(),
  publicKey: (import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY || import.meta.env.VITE_EMAILJS_PUBLIC_KEY_NEW || import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '').trim()
};

// Export configured service instance
export const emailService = new EmailService(defaultEmailConfig);

/**
 * Convenience functions for easy integration
 */
export async function sendConfirmationEmail(rsvpData: RSVPSubmission): Promise<void> {
  const result = await emailService.sendConfirmationEmail(rsvpData);
  if (!result.success) {
    throw new Error(result.error || 'Failed to send confirmation email');
  }
}

export async function sendUpdateEmail(rsvpData: RSVPSubmission): Promise<void> {
  const result = await emailService.sendUpdateNotification(rsvpData);
  if (!result.success) {
    throw new Error(result.error || 'Failed to send update email');
  }
}

export async function testEmailConnection(): Promise<{ success: boolean; error?: string }> {
  const result = await emailService.testConnection();
  return {
    success: result.success,
    error: result.error
  };
}

export async function validateEmailConfig(): Promise<{ isValid: boolean; errors: string[] }> {
  return emailService.validateConfiguration();
}