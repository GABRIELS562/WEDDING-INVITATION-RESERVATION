/**
 * Production-Grade Supabase Service Layer
 * Dale & Kirsten's Wedding RSVP System
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Guest, 
  RSVP, 
  RSVPSubmissionPayload, 
  ApiResponse, 
  RSVPStatistics,
  RSVPError,
  RSVPErrorCode,
  RateLimitInfo,
  SecurityContext
} from '@/types/rsvp';

// Environment configuration with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client with optimized configuration
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We don't need auth sessions for public RSVP
    autoRefreshToken: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-client-info': 'dale-kirsten-wedding-rsvp'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

/**
 * Rate limiting store for client-side protection
 */
class RateLimitStore {
  private store = new Map<string, RateLimitInfo>();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly lockoutMs = 30 * 60 * 1000; // 30 minutes

  check(key: string): RateLimitInfo {
    const now = Date.now();
    const existing = this.store.get(key);

    if (!existing) {
      const info: RateLimitInfo = {
        attempts: 1,
        lastAttempt: now,
        isLocked: false
      };
      this.store.set(key, info);
      return info;
    }

    // Check if locked
    if (existing.lockedUntil && now < existing.lockedUntil) {
      return { ...existing, isLocked: true };
    }

    // Reset if outside window
    if (now - existing.lastAttempt > this.windowMs) {
      const info: RateLimitInfo = {
        attempts: 1,
        lastAttempt: now,
        isLocked: false
      };
      this.store.set(key, info);
      return info;
    }

    // Increment attempts
    existing.attempts++;
    existing.lastAttempt = now;

    // Lock if exceeded
    if (existing.attempts > this.maxAttempts) {
      existing.lockedUntil = now + this.lockoutMs;
      existing.isLocked = true;
    }

    this.store.set(key, existing);
    return existing;
  }

  reset(key: string): void {
    this.store.delete(key);
  }
}

const rateLimiter = new RateLimitStore();

/**
 * Create security context for request tracking
 */
function createSecurityContext(): SecurityContext {
  return {
    ipAddress: 'client-side', // Will be handled by edge functions in production
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    timestamp: Date.now(),
    attempts: 1
  };
}

/**
 * Enhanced error handling with detailed error codes
 */
function handleSupabaseError(error: any, operation: string): RSVPError {
  console.error(`Supabase ${operation} error:`, error);

  if (error?.code === 'PGRST116') {
    return new RSVPError(RSVPErrorCode.TOKEN_NOT_FOUND, 'Guest token not found');
  }

  if (error?.code === '23505') {
    return new RSVPError(RSVPErrorCode.DUPLICATE_SUBMISSION, 'RSVP already submitted');
  }

  if (error?.message?.includes('network')) {
    return new RSVPError(RSVPErrorCode.NETWORK_ERROR, 'Network connection error');
  }

  if (error?.message?.includes('timeout')) {
    return new RSVPError(RSVPErrorCode.NETWORK_ERROR, 'Request timeout');
  }

  return new RSVPError(
    RSVPErrorCode.SERVER_ERROR, 
    error?.message || `${operation} failed`,
    error
  );
}

/**
 * Validate guest token and retrieve guest information
 */
export async function validateGuestToken(token: string): Promise<ApiResponse<Guest>> {
  try {
    // Client-side validation
    if (!token || token.length < 8) {
      throw new RSVPError(RSVPErrorCode.INVALID_TOKEN, 'Invalid token format');
    }

    // Rate limiting check
    const rateLimitInfo = rateLimiter.check(`validate:${token}`);
    if (rateLimitInfo.isLocked) {
      throw new RSVPError(RSVPErrorCode.RATE_LIMITED, 'Too many attempts. Please try again later.');
    }

    // Call Supabase function for token validation
    const { data, error } = await supabase
      .rpc('get_guest_by_token', { token })
      .select('*')
      .single();

    if (error) {
      throw handleSupabaseError(error, 'token validation');
    }

    if (!data) {
      throw new RSVPError(RSVPErrorCode.TOKEN_NOT_FOUND, 'Guest not found');
    }

    // Reset rate limit on success
    rateLimiter.reset(`validate:${token}`);

    return {
      success: true,
      data: {
        id: data.guest_id,
        guest_name: data.guest_name,
        whatsapp_number: data.whatsapp_number,
        unique_token: token,
        whatsapp_rsvp_link: data.whatsapp_rsvp_link,
        created_at: data.created_at
      }
    };

  } catch (error) {
    const rsvpError = error instanceof RSVPError ? error : handleSupabaseError(error, 'token validation');
    
    return {
      success: false,
      error: rsvpError.message,
      code: rsvpError.code
    };
  }
}

/**
 * Get existing RSVP for a guest token
 */
export async function getExistingRSVP(token: string): Promise<ApiResponse<RSVP | null>> {
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('guest_token', token)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw handleSupabaseError(error, 'get existing RSVP');
    }

    return {
      success: true,
      data: data || null
    };

  } catch (error) {
    const rsvpError = error instanceof RSVPError ? error : handleSupabaseError(error, 'get existing RSVP');
    
    return {
      success: false,
      error: rsvpError.message,
      code: rsvpError.code
    };
  }
}

/**
 * Submit RSVP with comprehensive validation and error handling
 */
export async function submitRSVP(payload: RSVPSubmissionPayload): Promise<ApiResponse<string>> {
  try {
    const securityContext = createSecurityContext();
    
    // Rate limiting check
    const rateLimitInfo = rateLimiter.check(`submit:${payload.guest_token}`);
    if (rateLimitInfo.isLocked) {
      throw new RSVPError(RSVPErrorCode.RATE_LIMITED, 'Too many submission attempts. Please try again later.');
    }

    // Validate required fields
    if (!payload.guest_name?.trim()) {
      throw new RSVPError(RSVPErrorCode.VALIDATION_ERROR, 'Guest name is required');
    }

    if (payload.attending === null || payload.attending === undefined) {
      throw new RSVPError(RSVPErrorCode.VALIDATION_ERROR, 'Please select if you will be attending');
    }

    if (payload.attending && !payload.meal_choice) {
      throw new RSVPError(RSVPErrorCode.VALIDATION_ERROR, 'Meal choice is required for attending guests');
    }

    // Validate email format if provided
    if (payload.email_address) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email_address)) {
        throw new RSVPError(RSVPErrorCode.VALIDATION_ERROR, 'Please enter a valid email address');
      }
    }

    // Submit using Supabase function
    const { data, error } = await supabase
      .rpc('submit_rsvp', {
        p_guest_token: payload.guest_token,
        p_guest_name: payload.guest_name,
        p_attending: payload.attending,
        p_meal_choice: payload.meal_choice,
        p_dietary_restrictions: payload.dietary_restrictions,
        p_email_address: payload.email_address,
        p_whatsapp_number: payload.whatsapp_number,
        p_wants_email_confirmation: payload.wants_email_confirmation,
        p_wants_whatsapp_confirmation: payload.wants_whatsapp_confirmation
      });

    if (error) {
      throw handleSupabaseError(error, 'RSVP submission');
    }

    // Reset rate limit on success
    rateLimiter.reset(`submit:${payload.guest_token}`);

    // Log successful submission (non-blocking)
    try {
      await supabase
        .from('submission_logs')
        .insert({
          guest_token: payload.guest_token,
          submission_id: data,
          security_context: securityContext,
          success: true
        });
    } catch (logError) {
      // Don't fail the submission if logging fails
      console.warn('Failed to log submission:', logError);
    }

    return {
      success: true,
      data: data // This is the submission_id UUID
    };

  } catch (error) {
    const rsvpError = error instanceof RSVPError ? error : handleSupabaseError(error, 'RSVP submission');
    
    // Log failed submission (non-blocking)
    try {
      await supabase
        .from('submission_logs')
        .insert({
          guest_token: payload.guest_token,
          security_context: createSecurityContext(),
          success: false,
          error_message: rsvpError.message,
          error_code: rsvpError.code
        });
    } catch (logError) {
      console.warn('Failed to log failed submission:', logError);
    }

    return {
      success: false,
      error: rsvpError.message,
      code: rsvpError.code
    };
  }
}

/**
 * Mark email confirmation as sent
 */
export async function markEmailConfirmationSent(token: string): Promise<ApiResponse<boolean>> {
  try {
    const { error } = await supabase
      .rpc('mark_email_confirmation_sent', { p_guest_token: token });

    if (error) {
      throw handleSupabaseError(error, 'mark email confirmation');
    }

    return { success: true, data: true };

  } catch (error) {
    const rsvpError = error instanceof RSVPError ? error : handleSupabaseError(error, 'mark email confirmation');
    
    return {
      success: false,
      error: rsvpError.message,
      code: rsvpError.code
    };
  }
}

/**
 * Mark WhatsApp confirmation as sent
 */
export async function markWhatsAppConfirmationSent(token: string): Promise<ApiResponse<boolean>> {
  try {
    const { error } = await supabase
      .rpc('mark_whatsapp_confirmation_sent', { p_guest_token: token });

    if (error) {
      throw handleSupabaseError(error, 'mark WhatsApp confirmation');
    }

    return { success: true, data: true };

  } catch (error) {
    const rsvpError = error instanceof RSVPError ? error : handleSupabaseError(error, 'mark WhatsApp confirmation');
    
    return {
      success: false,
      error: rsvpError.message,
      code: rsvpError.code
    };
  }
}

/**
 * Get comprehensive RSVP statistics for admin dashboard
 */
export async function getRSVPStatistics(): Promise<ApiResponse<RSVPStatistics>> {
  try {
    const { data, error } = await supabase
      .rpc('get_rsvp_statistics');

    if (error) {
      throw handleSupabaseError(error, 'get RSVP statistics');
    }

    return {
      success: true,
      data: data as RSVPStatistics
    };

  } catch (error) {
    const rsvpError = error instanceof RSVPError ? error : handleSupabaseError(error, 'get RSVP statistics');
    
    return {
      success: false,
      error: rsvpError.message,
      code: rsvpError.code
    };
  }
}

/**
 * Real-time subscription for RSVP updates (admin dashboard)
 */
export function subscribeToRSVPUpdates(callback: (payload: any) => void) {
  const subscription = supabase
    .channel('rsvp-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rsvps'
      },
      callback
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Health check for Supabase connection
 */
export async function healthCheck(): Promise<ApiResponse<boolean>> {
  try {
    const { error } = await supabase
      .from('guests')
      .select('count')
      .limit(1);

    if (error) {
      throw handleSupabaseError(error, 'health check');
    }

    return { success: true, data: true };

  } catch (error) {
    const rsvpError = error instanceof RSVPError ? error : handleSupabaseError(error, 'health check');
    
    return {
      success: false,
      error: rsvpError.message,
      code: rsvpError.code
    };
  }
}

/**
 * Batch operations for admin use
 */
export const adminOperations = {
  /**
   * Get all guests with their RSVP status
   */
  async getAllGuestsWithRSVPs(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('guest_rsvp_summary')
        .select('*')
        .order('guest_created_at', { ascending: true });

      if (error) {
        throw handleSupabaseError(error, 'get all guests');
      }

      return { success: true, data: data || [] };

    } catch (error) {
      const rsvpError = error instanceof RSVPError ? error : handleSupabaseError(error, 'get all guests');
      
      return {
        success: false,
        error: rsvpError.message,
        code: rsvpError.code
      };
    }
  },

  /**
   * Export all RSVP data for wedding planning
   */
  async exportRSVPData(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('guest_rsvp_summary')
        .select('*')
        .order('rsvp_timestamp', { ascending: false });

      if (error) {
        throw handleSupabaseError(error, 'export RSVP data');
      }

      return { success: true, data: data || [] };

    } catch (error) {
      const rsvpError = error instanceof RSVPError ? error : handleSupabaseError(error, 'export RSVP data');
      
      return {
        success: false,
        error: rsvpError.message,
        code: rsvpError.code
      };
    }
  }
};

// Export the configured client and all functions
export default {
  supabase,
  validateGuestToken,
  getExistingRSVP,
  submitRSVP,
  markEmailConfirmationSent,
  markWhatsAppConfirmationSent,
  getRSVPStatistics,
  subscribeToRSVPUpdates,
  healthCheck,
  adminOperations
};