/**
 * Production-Grade Form Validation with Zod
 * Dale & Kirsten's Wedding RSVP System
 */

import { z } from 'zod';
import { MealChoiceValue, MEAL_CHOICES } from '@/types/rsvp';

// Custom validation messages for better UX
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.expected === 'boolean' && issue.path.includes('attending')) {
        return { message: 'Please let us know if you will be attending' };
      }
      return { message: 'Please check this field' };
    
    case z.ZodIssueCode.too_small:
      if (issue.path.includes('guest_name')) {
        return { message: 'Please enter your full name' };
      }
      return { message: 'This field is too short' };
    
    case z.ZodIssueCode.too_big:
      if (issue.path.includes('dietary_restrictions')) {
        return { message: 'Please keep dietary restrictions under 500 characters' };
      }
      return { message: 'This field is too long' };
    
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === 'email') {
        return { message: 'Please enter a valid email address' };
      }
      return { message: 'Please check the format' };
    
    default:
      return { message: ctx.defaultError };
  }
};

z.setErrorMap(customErrorMap);

// Utility validation schemas
const nonEmptyString = z.string().trim().min(1);
const optionalNonEmptyString = z.string().trim().optional().or(z.literal(''));

// Guest token validation
const tokenSchema = z.string()
  .min(8, 'Invalid invitation token')
  .max(50, 'Invalid invitation token')
  .regex(/^[A-Z0-9]+$/, 'Invalid invitation token format');

// Email validation with enhanced rules
const emailSchema = z.string()
  .email('Please enter a valid email address')
  .max(255, 'Email address is too long')
  .toLowerCase()
  .optional()
  .or(z.literal(''));

// Phone number validation for WhatsApp
const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
  .optional()
  .or(z.literal(''));

// Meal choice validation
const mealChoiceSchema = z.enum(
  MEAL_CHOICES.map(choice => choice.value) as [MealChoiceValue, ...MealChoiceValue[]],
  {
    errorMap: () => ({ message: 'Please select a meal preference' })
  }
);

// Dietary restrictions with length limits
const dietaryRestrictionsSchema = z.string()
  .max(500, 'Please keep dietary restrictions under 500 characters')
  .optional()
  .or(z.literal(''));

// Guest name validation
const guestNameSchema = z.string()
  .trim()
  .min(2, 'Please enter your full name')
  .max(100, 'Name is too long')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Please use only letters, spaces, hyphens, and apostrophes');

// Main RSVP form validation schema
const rsvpFormSchema = z.object({
  attending: z.boolean({
    required_error: 'Please let us know if you will be attending',
    invalid_type_error: 'Please select yes or no'
  }),
  
  meal_choice: z.string()
    .optional()
    .refine((val, ctx) => {
      // Only require meal choice if attending
      const attending = ctx.parent?.attending;
      if (attending && (!val || val === '')) {
        return false;
      }
      return true;
    }, {
      message: 'Please select your meal preference'
    })
    .refine((val) => {
      // Validate meal choice is from allowed options
      if (val && val !== '') {
        return MEAL_CHOICES.some(choice => choice.value === val);
      }
      return true;
    }, {
      message: 'Please select a valid meal option'
    }),
  
  dietary_restrictions: dietaryRestrictionsSchema,
  
  email_address: emailSchema
});

// RSVP submission payload validation (server-side)
const rsvpSubmissionSchema = z.object({
  guest_token: tokenSchema,
  guest_name: guestNameSchema,
  attending: z.boolean(),
  meal_choice: z.string().optional(),
  dietary_restrictions: dietaryRestrictionsSchema,
  email_address: emailSchema,
  whatsapp_number: phoneSchema,
  wants_email_confirmation: z.boolean().default(false),
  wants_whatsapp_confirmation: z.boolean().default(false)
}).refine((data) => {
  // If attending, meal choice is required
  if (data.attending && (!data.meal_choice || data.meal_choice === '')) {
    return false;
  }
  return true;
}, {
  message: 'Meal selection is required for attending guests',
  path: ['meal_choice']
});

// Guest data validation for admin operations
const guestSchema = z.object({
  id: z.string().uuid(),
  guest_name: guestNameSchema,
  whatsapp_number: phoneSchema,
  unique_token: tokenSchema,
  whatsapp_rsvp_link: z.string().url().optional(),
  created_at: z.string().datetime()
});

// RSVP data validation
const rsvpSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  guest_token: tokenSchema,
  guest_name: guestNameSchema,
  attending: z.boolean(),
  meal_choice: z.string().optional(),
  dietary_restrictions: dietaryRestrictionsSchema,
  email_address: emailSchema,
  email_confirmation_sent: z.boolean(),
  submission_id: z.string().uuid(),
  whatsapp_number: phoneSchema,
  whatsapp_confirmation: z.boolean()
});

// URL parameter validation
const urlParamsSchema = z.object({
  token: tokenSchema.optional()
});

// API response validation
const apiResponseSchema = <T extends z.ZodSchema>(dataSchema: T) => 
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    code: z.string().optional()
  });

// Validation utility functions
export class ValidationUtils {
  /**
   * Validate form data and return formatted errors
   */
  static validateRSVPForm(data: any): {
    success: boolean;
    errors: Record<string, string>;
    data?: any;
  } {
    try {
      const validatedData = rsvpFormSchema.parse(data);
      return {
        success: true,
        errors: {},
        data: validatedData
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        return {
          success: false,
          errors
        };
      }
      return {
        success: false,
        errors: { general: 'Validation failed' }
      };
    }
  }

  /**
   * Validate individual field with real-time feedback
   */
  static validateField(
    fieldName: keyof z.infer<typeof rsvpFormSchema>,
    value: any,
    context?: any
  ): {
    isValid: boolean;
    error?: string;
  } {
    try {
      // Create a partial schema for the specific field
      const fieldSchema = rsvpFormSchema.pick({ [fieldName]: true });
      
      // For meal_choice validation, we need the attending context
      if (fieldName === 'meal_choice' && context?.attending) {
        fieldSchema.parse({ [fieldName]: value });
      } else if (fieldName !== 'meal_choice') {
        fieldSchema.parse({ [fieldName]: value });
      }
      
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: error.errors[0]?.message || 'Invalid value'
        };
      }
      return {
        isValid: false,
        error: 'Validation error'
      };
    }
  }

  /**
   * Sanitize user input to prevent XSS and injection attacks
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .slice(0, 1000); // Limit length
  }

  /**
   * Validate email format with additional checks
   */
  static isValidEmail(email: string): boolean {
    if (!email) return true; // Email is optional
    
    try {
      emailSchema.parse(email);
      
      // Additional checks
      const domain = email.split('@')[1];
      if (!domain || domain.length < 3) return false;
      
      // Check for common typos
      const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      const suspiciousDomains = ['gmial.com', 'yahooo.com', 'hotmial.com'];
      
      if (suspiciousDomains.includes(domain)) return false;
      
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Progressive validation for better UX
   */
  static getFieldValidationState(
    fieldName: string,
    value: any,
    touched: boolean,
    context?: any
  ): 'idle' | 'valid' | 'invalid' | 'warning' {
    if (!touched) return 'idle';
    
    const result = this.validateField(fieldName as any, value, context);
    
    if (!result.isValid) return 'invalid';
    
    // Special warnings for better UX
    if (fieldName === 'email_address' && value) {
      const domain = value.split('@')[1];
      const typoSuggestions = {
        'gmial.com': 'gmail.com',
        'yahooo.com': 'yahoo.com',
        'hotmial.com': 'hotmail.com'
      };
      
      if (typoSuggestions[domain]) {
        return 'warning';
      }
    }
    
    return 'valid';
  }

  /**
   * Get suggestion for email typos
   */
  static getEmailSuggestion(email: string): string | null {
    if (!email.includes('@')) return null;
    
    const domain = email.split('@')[1];
    const typoSuggestions = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'hotmai.com': 'hotmail.com',
      'outlok.com': 'outlook.com'
    };
    
    if (typoSuggestions[domain]) {
      return email.replace(domain, typoSuggestions[domain]);
    }
    
    return null;
  }
}

// Export schemas and utilities
export {
  rsvpFormSchema,
  rsvpSubmissionSchema,
  guestSchema,
  rsvpSchema,
  urlParamsSchema,
  apiResponseSchema,
  tokenSchema,
  emailSchema,
  phoneSchema,
  mealChoiceSchema,
  dietaryRestrictionsSchema,
  guestNameSchema
};

// Type exports for better TypeScript integration
export type RSVPFormData = z.infer<typeof rsvpFormSchema>;
export type RSVPSubmissionData = z.infer<typeof rsvpSubmissionSchema>;
export type GuestData = z.infer<typeof guestSchema>;
export type RSVPData = z.infer<typeof rsvpSchema>;
export type URLParams = z.infer<typeof urlParamsSchema>;