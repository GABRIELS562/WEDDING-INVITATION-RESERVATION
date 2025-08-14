/**
 * WhatsApp Message Template Engine
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Provides sophisticated message templating with personalization,
 * multi-language support, and professional wedding invitation formatting.
 */

import { MessageTemplate, WhatsAppGuest, WhatsAppTemplate, MessageVariable } from '../types/whatsapp';

// Default message templates for different occasions
export const DEFAULT_TEMPLATES: Record<string, MessageTemplate> = {
  INVITATION: {
    greeting: "Hi {{guest_name}}! 💕",
    main_message: "You're cordially invited to Dale & Kirsten's wedding celebration!",
    rsvp_instruction: "Please RSVP by {{rsvp_deadline}} using this secure link:",
    deadline_reminder: "⏰ RSVP Deadline: {{rsvp_deadline}}",
    closing: "We can't wait to celebrate with you!",
    signature: "🎉 With love,\nDale & Kirsten",
    emojis: {
      heart: "💕",
      ring: "💍",
      celebration: "🎉",
      calendar: "📅"
    }
  },

  REMINDER: {
    greeting: "Hello {{guest_name}}! 👋",
    main_message: "This is a gentle reminder about Dale & Kirsten's wedding RSVP.",
    rsvp_instruction: "We haven't received your RSVP yet. Please respond by {{rsvp_deadline}}:",
    deadline_reminder: "⚠️ Only {{days_remaining}} days left to RSVP!",
    closing: "Your presence would mean the world to us!",
    signature: "💝 Dale & Kirsten",
    emojis: {
      heart: "💝",
      ring: "💍",
      celebration: "🥳",
      calendar: "⏰"
    }
  },

  THANK_YOU: {
    greeting: "Dear {{guest_name}}, 🙏",
    main_message: "Thank you so much for your RSVP!",
    rsvp_instruction: "We're thrilled that you'll be joining us on our special day.",
    deadline_reminder: "📅 Wedding Date: {{wedding_date}} at {{wedding_venue}}",
    closing: "See you at the celebration!",
    signature: "❤️ Dale & Kirsten",
    emojis: {
      heart: "❤️",
      ring: "💍",
      celebration: "🎊",
      calendar: "📅"
    }
  },

  FOLLOW_UP: {
    greeting: "Hi {{guest_name}}, 😊",
    main_message: "We wanted to follow up on Dale & Kirsten's wedding invitation.",
    rsvp_instruction: "If you're having any issues with the RSVP link, please use this one:",
    deadline_reminder: "📞 Need help? Contact us at {{contact_email}}",
    closing: "We hope to see you there!",
    signature: "🌟 Dale & Kirsten",
    emojis: {
      heart: "💖",
      ring: "💍",
      celebration: "✨",
      calendar: "📆"
    }
  }
};

// Multi-language templates
export const MULTILINGUAL_TEMPLATES: Record<string, Record<string, MessageTemplate>> = {
  en: DEFAULT_TEMPLATES,
  af: {
    INVITATION: {
      greeting: "Hallo {{guest_name}}! 💕",
      main_message: "Jy is hartlik genooi na Dale & Kirsten se troue-viering!",
      rsvp_instruction: "RSVP asseblief teen {{rsvp_deadline}} met hierdie veilige skakel:",
      deadline_reminder: "⏰ RSVP Sperdatum: {{rsvp_deadline}}",
      closing: "Ons kan nie wag om saam met jou te vier nie!",
      signature: "🎉 Met liefde,\nDale & Kirsten",
      emojis: { heart: "💕", ring: "💍", celebration: "🎉", calendar: "📅" }
    }
  }
};

/**
 * Template variable definitions and their descriptions
 */
export const TEMPLATE_VARIABLES: Record<MessageVariable, {
  description: string;
  required: boolean;
  example: string;
  validator?: (value: string) => boolean;
}> = {
  guest_name: {
    description: "The guest's full name",
    required: true,
    example: "John Smith",
    validator: (value) => value.length > 0
  },
  rsvp_link: {
    description: "The personalized RSVP URL",
    required: true,
    example: "https://example.com/rsvp?token=abc123",
    validator: (value) => value.startsWith('http')
  },
  rsvp_deadline: {
    description: "The RSVP deadline date",
    required: true,
    example: "March 15th, 2024",
    validator: (value) => value.length > 0
  },
  wedding_date: {
    description: "The wedding ceremony date",
    required: false,
    example: "April 20th, 2024",
    validator: (value) => value.length > 0
  },
  wedding_venue: {
    description: "The wedding venue name",
    required: false,
    example: "Cape Point Vista",
    validator: (value) => value.length > 0
  },
  couple_names: {
    description: "The couple's names",
    required: false,
    example: "Dale & Kirsten",
    validator: (value) => value.includes('&')
  },
  contact_email: {
    description: "Contact email for questions",
    required: false,
    example: "wedding@example.com",
    validator: (value) => value.includes('@')
  },
  custom_message: {
    description: "Custom personalized message",
    required: false,
    example: "We're so excited to have you there!",
    validator: () => true
  }
};

/**
 * Professional wedding message tone analyzer
 */
export const TONE_ANALYSIS = {
  FORMAL: {
    patterns: ['cordially', 'honour', 'request the pleasure', 'ceremony'],
    score: (text: string) => countPatterns(text.toLowerCase(), TONE_ANALYSIS.FORMAL.patterns)
  },
  CASUAL: {
    patterns: ['hey', 'can\'t wait', 'gonna be', 'super excited'],
    score: (text: string) => countPatterns(text.toLowerCase(), TONE_ANALYSIS.CASUAL.patterns)
  },
  WARM: {
    patterns: ['love', 'dear', 'warm', 'heartfelt', 'special'],
    score: (text: string) => countPatterns(text.toLowerCase(), TONE_ANALYSIS.WARM.patterns)
  }
};

function countPatterns(text: string, patterns: string[]): number {
  return patterns.reduce((count, pattern) => {
    return count + (text.includes(pattern) ? 1 : 0);
  }, 0);
}

/**
 * Main template engine class
 */
export class WhatsAppTemplateEngine {
  private templates: Map<string, MessageTemplate> = new Map();
  private variables: Record<string, string> = {};

  constructor(language: 'en' | 'af' | 'zu' | 'xh' = 'en') {
    this.loadDefaultTemplates(language);
  }

  /**
   * Load default templates for specified language
   */
  private loadDefaultTemplates(language: string): void {
    const templates = MULTILINGUAL_TEMPLATES[language] || MULTILINGUAL_TEMPLATES.en;
    Object.entries(templates).forEach(([key, template]) => {
      this.templates.set(key, template);
    });
  }

  /**
   * Set global template variables
   */
  setGlobalVariables(variables: Record<string, string>): void {
    this.variables = { ...this.variables, ...variables };
  }

  /**
   * Generate personalized WhatsApp message for a guest
   */
  generateMessage(
    templateKey: string,
    guest: WhatsAppGuest,
    additionalVariables: Record<string, string> = {}
  ): {
    message: string;
    encodedMessage: string;
    estimatedLength: number;
    warnings: string[];
    personalizations: Record<string, string>;
  } {
    const template = this.templates.get(templateKey);
    if (!template) {
      throw new Error(`Template '${templateKey}' not found`);
    }

    // Combine all variables
    const allVariables = {
      ...this.variables,
      ...additionalVariables,
      guest_name: guest.guest_name,
      rsvp_link: guest.rsvp_url,
      // Add computed variables
      days_remaining: this.calculateDaysRemaining(this.variables.rsvp_deadline || ''),
    };

    // Generate message components
    const greeting = this.processTemplate(template.greeting, allVariables);
    const mainMessage = this.processTemplate(template.main_message, allVariables);
    const rsvpInstruction = this.processTemplate(template.rsvp_instruction, allVariables);
    const deadlineReminder = this.processTemplate(template.deadline_reminder, allVariables);
    const closing = this.processTemplate(template.closing, allVariables);
    const signature = this.processTemplate(template.signature, allVariables);

    // Compose final message
    const message = [
      greeting,
      '',
      mainMessage,
      '',
      rsvpInstruction,
      guest.rsvp_url,
      '',
      deadlineReminder,
      '',
      closing,
      '',
      signature
    ].join('\n').trim();

    // Encode for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    
    // Calculate statistics and warnings
    const estimatedLength = message.length;
    const warnings = this.analyzeMessage(message, allVariables);

    return {
      message,
      encodedMessage,
      estimatedLength,
      warnings,
      personalizations: allVariables,
    };
  }

  /**
   * Process template string with variable substitution
   */
  private processTemplate(templateStr: string, variables: Record<string, string>): string {
    return templateStr.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return variables[varName] || match;
    });
  }

  /**
   * Calculate days remaining until deadline
   */
  private calculateDaysRemaining(deadline: string): string {
    if (!deadline) return '0';
    
    try {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const diffTime = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return Math.max(0, diffDays).toString();
    } catch {
      return '0';
    }
  }

  /**
   * Analyze message for potential issues and improvements
   */
  private analyzeMessage(message: string, variables: Record<string, string>): string[] {
    const warnings: string[] = [];
    
    // Check message length
    if (message.length > 1600) {
      warnings.push('Message is quite long and may be truncated on some devices');
    }

    // Check for missing variables
    const missingVariables = message.match(/\{\{(\w+)\}\}/g);
    if (missingVariables) {
      warnings.push(`Unresolved variables: ${missingVariables.join(', ')}`);
    }

    // Check for required variables
    Object.entries(TEMPLATE_VARIABLES).forEach(([varName, config]) => {
      if (config.required && !variables[varName]) {
        warnings.push(`Missing required variable: ${varName}`);
      }
    });

    // Validate URLs
    if (variables.rsvp_link && !variables.rsvp_link.startsWith('http')) {
      warnings.push('RSVP link should be a valid HTTP/HTTPS URL');
    }

    // Check tone consistency
    const toneScores = {
      formal: TONE_ANALYSIS.FORMAL.score(message),
      casual: TONE_ANALYSIS.CASUAL.score(message),
      warm: TONE_ANALYSIS.WARM.score(message),
    };

    const maxToneScore = Math.max(...Object.values(toneScores));
    if (maxToneScore === 0) {
      warnings.push('Message may lack emotional warmth or personality');
    }

    return warnings;
  }

  /**
   * Generate message preview with sample data
   */
  generatePreview(templateKey: string, sampleGuest?: Partial<WhatsAppGuest>): {
    message: string;
    variables: Record<string, string>;
    warnings: string[];
  } {
    const sampleData: WhatsAppGuest = {
      id: 'preview-1',
      guest_name: sampleGuest?.guest_name || 'John Smith',
      phone_number: '+27123456789',
      guest_token: 'SAMPLE123',
      rsvp_url: sampleGuest?.rsvp_url || 'https://daleandkirsten.com/rsvp?token=SAMPLE123',
      whatsapp_link: '',
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
      priority: 'normal',
    };

    const result = this.generateMessage(templateKey, sampleData);
    
    return {
      message: result.message,
      variables: result.personalizations,
      warnings: result.warnings,
    };
  }

  /**
   * Validate template syntax
   */
  validateTemplate(template: MessageTemplate): {
    isValid: boolean;
    errors: string[];
    suggestions: string[];
  } {
    const errors: string[] = [];
    const suggestions: string[] = [];

    // Check if template contains required components
    if (!template.greeting.trim()) {
      errors.push('Template must include a greeting');
    }

    if (!template.main_message.trim()) {
      errors.push('Template must include a main message');
    }

    // Check for balanced variable usage
    const allText = Object.values(template).join(' ');
    const variableMatches = allText.match(/\{\{(\w+)\}\}/g) || [];
    const uniqueVariables = new Set(variableMatches);

    if (!allText.includes('{{guest_name}}')) {
      suggestions.push('Consider personalizing with {{guest_name}}');
    }

    if (!allText.includes('{{rsvp_link}}') && !allText.includes('{{rsvp_deadline}}')) {
      errors.push('Template should include either {{rsvp_link}} or {{rsvp_deadline}}');
    }

    // Check message tone and professionalism
    if (allText.toLowerCase().includes('deadline') && !allText.toLowerCase().includes('please')) {
      suggestions.push('Consider using polite language like "please" with deadlines');
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions,
    };
  }

  /**
   * Create custom template
   */
  createTemplate(key: string, template: MessageTemplate): boolean {
    const validation = this.validateTemplate(template);
    if (!validation.isValid) {
      throw new Error(`Invalid template: ${validation.errors.join(', ')}`);
    }

    this.templates.set(key, template);
    return true;
  }

  /**
   * Get all available templates
   */
  getAvailableTemplates(): Map<string, MessageTemplate> {
    return new Map(this.templates);
  }

  /**
   * Generate bulk messages for campaign
   */
  generateBulkMessages(
    templateKey: string,
    guests: WhatsAppGuest[],
    additionalVariables: Record<string, string> = {}
  ): Array<{
    guestId: string;
    message: string;
    encodedMessage: string;
    estimatedLength: number;
    warnings: string[];
  }> {
    return guests.map(guest => {
      try {
        const result = this.generateMessage(templateKey, guest, additionalVariables);
        return {
          guestId: guest.id,
          ...result,
        };
      } catch (error) {
        return {
          guestId: guest.id,
          message: '',
          encodedMessage: '',
          estimatedLength: 0,
          warnings: [`Error generating message: ${error instanceof Error ? error.message : 'Unknown error'}`],
        };
      }
    });
  }
}

// Export default instance
export const defaultTemplateEngine = new WhatsAppTemplateEngine('en');

// Utility functions
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

export default WhatsAppTemplateEngine;