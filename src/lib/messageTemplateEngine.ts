/**
 * WhatsApp Message Template Engine
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Professional message templating system with personalization and formatting
 */

import { MessageTemplate, WhatsAppGuest, WhatsAppTemplate, MessageVariable } from '@/types/whatsapp';

interface TemplateVariables {
  guest_name: string;
  rsvp_link: string;
  rsvp_deadline: string;
  wedding_date: string;
  wedding_venue: string;
  couple_names: string;
  contact_email: string;
  custom_message?: string;
  greeting_time?: string;
  days_until_deadline?: string;
  days_until_wedding?: string;
}

interface MessageOptions {
  include_emojis: boolean;
  formal_tone: boolean;
  include_deadline: boolean;
  include_venue: boolean;
  add_urgency: boolean;
  personalized_greeting: boolean;
  include_contact: boolean;
}

class MessageTemplateEngine {
  private readonly WEDDING_CONFIG = {
    couple_names: 'Dale & Kirsten',
    wedding_date: 'October 31st, 2025',
    wedding_venue: 'Cape Point Vineyards, Cape Town',
    rsvp_deadline: 'September 30th, 2025',
    contact_email: 'kirstendale583@gmail.com',
    website_url: 'https://kirstendale.com'
  };

  private readonly DEFAULT_TEMPLATE: MessageTemplate = {
    greeting: "Hi {guest_name}! 💕",
    main_message: "You're cordially invited to {couple_names}'s wedding celebration on {wedding_date} at {wedding_venue}.",
    rsvp_instruction: "Please RSVP using this secure link: {rsvp_link}",
    deadline_reminder: "Kindly respond by {rsvp_deadline} to help us finalize arrangements.",
    closing: "We can't wait to celebrate with you!",
    signature: "With love,\n{couple_names}",
    emojis: {
      heart: "💕",
      ring: "💍",
      celebration: "🎉",
      calendar: "📅"
    }
  };

  private readonly PREDEFINED_TEMPLATES: { [key: string]: WhatsAppTemplate } = {
    formal_invitation: {
      id: 'formal_invitation',
      name: 'Formal Wedding Invitation',
      template_text: `Dear {guest_name},

You are cordially invited to the wedding celebration of {couple_names}.

📅 Date: {wedding_date}
📍 Venue: {wedding_venue}

Please confirm your attendance by {rsvp_deadline} using this link:
{rsvp_link}

Your presence would mean the world to us.

Warm regards,
{couple_names}`,
      variables: ['guest_name', 'couple_names', 'wedding_date', 'wedding_venue', 'rsvp_deadline', 'rsvp_link'],
      category: 'invitation',
      is_default: true,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    casual_invitation: {
      id: 'casual_invitation',
      name: 'Casual Wedding Invitation',
      template_text: `Hey {guest_name}! 💕

We're getting married and we want you there! 💍

{couple_names} are tying the knot on {wedding_date} at {wedding_venue}.

RSVP here: {rsvp_link}
Deadline: {rsvp_deadline}

Can't wait to party with you! 🎉

Love,
{couple_names}`,
      variables: ['guest_name', 'couple_names', 'wedding_date', 'wedding_venue', 'rsvp_deadline', 'rsvp_link'],
      category: 'invitation',
      is_default: false,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    reminder_gentle: {
      id: 'reminder_gentle',
      name: 'Gentle RSVP Reminder',
      template_text: `Hi {guest_name}! 💕

Just a friendly reminder about {couple_names}'s wedding on {wedding_date}.

We haven't received your RSVP yet and would love to know if you can join us! 

Please respond by {rsvp_deadline}: {rsvp_link}

Thank you! 🎉

{couple_names}`,
      variables: ['guest_name', 'couple_names', 'wedding_date', 'rsvp_deadline', 'rsvp_link'],
      category: 'reminder',
      is_default: false,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    reminder_urgent: {
      id: 'reminder_urgent',
      name: 'Urgent RSVP Reminder',
      template_text: `Hi {guest_name}!

⏰ URGENT: RSVP deadline is {rsvp_deadline} - only {days_until_deadline} days left!

We need your response for {couple_names}'s wedding on {wedding_date} to finalize catering and seating.

Please RSVP immediately: {rsvp_link}

Thanks for your quick response!

{couple_names}`,
      variables: ['guest_name', 'couple_names', 'wedding_date', 'rsvp_deadline', 'rsvp_link', 'days_until_deadline'],
      category: 'reminder',
      is_default: false,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    thank_you: {
      id: 'thank_you',
      name: 'Thank You Message',
      template_text: `Thank you {guest_name}! 💕

We've received your RSVP for {couple_names}'s wedding on {wedding_date}.

{custom_message}

We're so excited to celebrate with you! 🎉

If you need to make any changes, use this link: {rsvp_link}

Love,
{couple_names}`,
      variables: ['guest_name', 'couple_names', 'wedding_date', 'rsvp_link', 'custom_message'],
      category: 'thank_you',
      is_default: false,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  /**
   * Generate personalized WhatsApp message for a guest
   */
  generateMessage(
    guest: WhatsAppGuest,
    templateId: string = 'formal_invitation',
    customVariables: Partial<TemplateVariables> = {},
    options: Partial<MessageOptions> = {}
  ): {
    message: string;
    encodedMessage: string;
    messageLength: number;
    characterCount: { total: number; withSpaces: number; withoutSpaces: number };
    estimatedLines: number;
    variables: TemplateVariables;
  } {
    const template = this.PREDEFINED_TEMPLATES[templateId] || this.PREDEFINED_TEMPLATES.formal_invitation;
    const config = {
      include_emojis: true,
      formal_tone: false,
      include_deadline: true,
      include_venue: true,
      add_urgency: false,
      personalized_greeting: true,
      include_contact: true,
      ...options
    };

    // Prepare variables
    const variables = this.prepareVariables(guest, customVariables);
    
    // Process template
    let message = template.template_text;
    
    // Replace all variables
    Object.entries(variables).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        message = message.replace(regex, value.toString());
      }
    });

    // Apply formatting options
    if (!config.include_emojis) {
      message = this.removeEmojis(message);
    }

    if (config.add_urgency && templateId.includes('reminder')) {
      message = this.addUrgencyMarkers(message);
    }

    // Clean up any remaining placeholders
    message = this.cleanupMessage(message);

    // Generate analytics
    const characterCount = {
      total: message.length,
      withSpaces: message.length,
      withoutSpaces: message.replace(/\s/g, '').length
    };

    const estimatedLines = Math.ceil(message.length / 35); // Approximate lines on mobile

    return {
      message,
      encodedMessage: encodeURIComponent(message),
      messageLength: message.length,
      characterCount,
      estimatedLines,
      variables
    };
  }

  /**
   * Generate WhatsApp link with message
   */
  generateWhatsAppLink(
    guest: WhatsAppGuest,
    message?: string,
    templateId: string = 'formal_invitation'
  ): {
    whatsappUrl: string;
    webUrl: string;
    mobileUrl: string;
    message: string;
    isValidPhone: boolean;
  } {
    // Use provided message or generate one
    const finalMessage = message || this.generateMessage(guest, templateId).message;
    
    // Validate and clean phone number
    const phoneValidation = this.validatePhoneNumber(guest.phone_number);
    
    if (!phoneValidation.isValid) {
      throw new Error(`Invalid phone number for ${guest.guest_name}: ${phoneValidation.errors.join(', ')}`);
    }

    const cleanPhone = phoneValidation.cleanNumber;
    const encodedMessage = encodeURIComponent(finalMessage);

    // Generate different URL formats
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    const webUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
    const mobileUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;

    return {
      whatsappUrl,
      webUrl,
      mobileUrl,
      message: finalMessage,
      isValidPhone: phoneValidation.isValid
    };
  }

  /**
   * Batch generate messages for multiple guests
   */
  generateBatchMessages(
    guests: WhatsAppGuest[],
    templateId: string = 'formal_invitation',
    options: Partial<MessageOptions> = {}
  ): Array<{
    guestId: string;
    guestName: string;
    message: string;
    whatsappUrl: string;
    success: boolean;
    error?: string;
  }> {
    return guests.map(guest => {
      try {
        const messageResult = this.generateMessage(guest, templateId, {}, options);
        const linkResult = this.generateWhatsAppLink(guest, messageResult.message);

        return {
          guestId: guest.id,
          guestName: guest.guest_name,
          message: messageResult.message,
          whatsappUrl: linkResult.whatsappUrl,
          success: true
        };
      } catch (error) {
        return {
          guestId: guest.id,
          guestName: guest.guest_name,
          message: '',
          whatsappUrl: '',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });
  }

  /**
   * Create custom template
   */
  createCustomTemplate(
    name: string,
    templateText: string,
    category: 'invitation' | 'reminder' | 'thank_you' | 'update' | 'custom' = 'custom'
  ): WhatsAppTemplate {
    const variables = this.extractVariables(templateText);
    
    return {
      id: `custom_${Date.now()}`,
      name,
      template_text: templateText,
      variables,
      category,
      is_default: false,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Preview message with sample data
   */
  previewMessage(
    templateId: string,
    customVariables: Partial<TemplateVariables> = {},
    options: Partial<MessageOptions> = {}
  ): {
    message: string;
    variables: TemplateVariables;
    characterCount: number;
    estimatedCost: number; // WhatsApp business cost estimation
  } {
    // Create sample guest for preview
    const sampleGuest: WhatsAppGuest = {
      id: 'preview',
      guest_name: 'John Smith',
      phone_number: '+27821234567',
      guest_token: 'PREVIEW123',
      rsvp_url: 'https://kirstendale.com/rsvp?token=PREVIEW123',
      whatsapp_link: '',
      message_preview: '',
      has_plus_one: false,
      is_child: false,
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
      tags: [],
      priority: 'normal'
    };

    const result = this.generateMessage(sampleGuest, templateId, customVariables, options);
    
    // Estimate WhatsApp Business cost (approximate)
    const estimatedCost = this.estimateMessageCost(result.message);

    return {
      message: result.message,
      variables: result.variables,
      characterCount: result.characterCount.total,
      estimatedCost
    };
  }

  /**
   * Get all available templates
   */
  getAvailableTemplates(): WhatsAppTemplate[] {
    return Object.values(this.PREDEFINED_TEMPLATES);
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): WhatsAppTemplate | null {
    return this.PREDEFINED_TEMPLATES[templateId] || null;
  }

  /**
   * Validate template syntax
   */
  validateTemplate(templateText: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    variables: string[];
    characterCount: number;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Extract variables
    const variables = this.extractVariables(templateText);
    
    // Check for required variables
    const requiredVars = ['guest_name', 'rsvp_link'];
    const missingRequired = requiredVars.filter(req => !variables.includes(req));
    
    if (missingRequired.length > 0) {
      errors.push(`Missing required variables: ${missingRequired.join(', ')}`);
    }

    // Check for unknown variables
    const knownVars = ['guest_name', 'rsvp_link', 'rsvp_deadline', 'wedding_date', 'wedding_venue', 'couple_names', 'contact_email', 'custom_message'];
    const unknownVars = variables.filter(v => !knownVars.includes(v));
    
    if (unknownVars.length > 0) {
      warnings.push(`Unknown variables (will not be replaced): ${unknownVars.join(', ')}`);
    }

    // Check message length
    const characterCount = templateText.length;
    if (characterCount > 4096) {
      errors.push('Message too long (WhatsApp limit: 4096 characters)');
    } else if (characterCount > 1000) {
      warnings.push('Message is quite long and may be truncated on some devices');
    }

    // Check for common formatting issues
    if (templateText.includes('\n\n\n')) {
      warnings.push('Multiple consecutive line breaks detected');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      variables,
      characterCount
    };
  }

  // Private helper methods

  private prepareVariables(
    guest: WhatsAppGuest, 
    customVariables: Partial<TemplateVariables> = {}
  ): TemplateVariables {
    // Calculate deadline urgency
    const deadlineDate = new Date('2025-09-30');
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate wedding date
    const weddingDate = new Date('2025-10-31');
    const daysUntilWedding = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Determine greeting based on time
    const hour = new Date().getHours();
    let greetingTime = 'Hello';
    if (hour < 12) greetingTime = 'Good morning';
    else if (hour < 17) greetingTime = 'Good afternoon';
    else greetingTime = 'Good evening';

    return {
      guest_name: guest.guest_name,
      rsvp_link: guest.rsvp_url,
      rsvp_deadline: this.WEDDING_CONFIG.rsvp_deadline,
      wedding_date: this.WEDDING_CONFIG.wedding_date,
      wedding_venue: this.WEDDING_CONFIG.wedding_venue,
      couple_names: this.WEDDING_CONFIG.couple_names,
      contact_email: this.WEDDING_CONFIG.contact_email,
      greeting_time: greetingTime,
      days_until_deadline: daysUntilDeadline > 0 ? daysUntilDeadline.toString() : '0',
      days_until_wedding: daysUntilWedding > 0 ? daysUntilWedding.toString() : '0',
      ...customVariables
    };
  }

  private extractVariables(templateText: string): string[] {
    const variableRegex = /\{([^}]+)\}/g;
    const variables: string[] = [];
    let match;

    while ((match = variableRegex.exec(templateText)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  }

  private validatePhoneNumber(phoneNumber: string): {
    isValid: boolean;
    cleanNumber: string;
    errors: string[];
  } {
    const errors: string[] = [];
    
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (cleanNumber.length < 10) {
      errors.push('Phone number too short');
    }
    
    if (cleanNumber.length > 15) {
      errors.push('Phone number too long');
    }

    return {
      isValid: errors.length === 0,
      cleanNumber,
      errors
    };
  }

  private removeEmojis(text: string): string {
    return text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  }

  private addUrgencyMarkers(message: string): string {
    return message.replace(/URGENT:/g, '🚨 URGENT:').replace(/urgent/gi, 'URGENT ⏰');
  }

  private cleanupMessage(message: string): string {
    // Remove any remaining variable placeholders
    return message
      .replace(/\{[^}]*\}/g, '[MISSING]')
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
      .trim();
  }

  private estimateMessageCost(message: string): number {
    // WhatsApp Business API pricing is approximately $0.005-0.009 per message
    // This is a rough estimate
    const baseRate = 0.007; // USD per message
    const characterCount = message.length;
    
    // Longer messages might incur additional costs
    const multiplier = characterCount > 1000 ? 1.2 : 1.0;
    
    return baseRate * multiplier;
  }
}

// Export singleton instance
export const messageTemplateEngine = new MessageTemplateEngine();
export default messageTemplateEngine;