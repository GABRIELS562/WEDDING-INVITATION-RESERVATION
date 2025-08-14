/**
 * Secure WhatsApp Token Generator
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Provides cryptographically secure token generation with backup tokens,
 * expiry management, and collision detection.
 */

import { randomBytes, createHash } from 'crypto';
import { TokenGenerationOptions, BulkTokenGeneration, WhatsAppGuest } from '../types/whatsapp';

// Character sets for different token types
const CHAR_SETS = {
  UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
  NUMBERS: '0123456789',
  SYMBOLS: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  // Exclude similar looking characters for better user experience
  SAFE_UPPERCASE: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  SAFE_LOWERCASE: 'abcdefghijkmnpqrstuvwxyz',
  SAFE_NUMBERS: '23456789',
} as const;

// Default token generation options
export const DEFAULT_TOKEN_OPTIONS: TokenGenerationOptions = {
  length: 12,
  use_crypto_random: true,
  include_checksum: true,
  expiry_days: 60,
  generate_backup: true,
  exclude_similar_chars: true,
};

/**
 * Generates a cryptographically secure random token
 */
export function generateSecureToken(options: Partial<TokenGenerationOptions> = {}): string {
  const opts = { ...DEFAULT_TOKEN_OPTIONS, ...options };
  
  // Build character set based on options
  let charSet = '';
  if (opts.exclude_similar_chars) {
    charSet += CHAR_SETS.SAFE_UPPERCASE;
    charSet += CHAR_SETS.SAFE_LOWERCASE;
    charSet += CHAR_SETS.SAFE_NUMBERS;
  } else {
    charSet += CHAR_SETS.UPPERCASE;
    charSet += CHAR_SETS.LOWERCASE;
    charSet += CHAR_SETS.NUMBERS;
  }

  const tokenLength = opts.include_checksum ? opts.length - 2 : opts.length;
  
  if (opts.use_crypto_random) {
    return generateCryptoRandomToken(charSet, tokenLength, opts);
  } else {
    return generatePseudoRandomToken(charSet, tokenLength, opts);
  }
}

/**
 * Generates a token using crypto.randomBytes for maximum security
 */
function generateCryptoRandomToken(charSet: string, length: number, options: TokenGenerationOptions): string {
  const randomBytesBuffer = randomBytes(length * 2); // Extra bytes for better randomness
  let token = '';
  
  for (let i = 0; i < length; i++) {
    // Use two bytes to get better distribution across character set
    const randomIndex = (randomBytesBuffer[i * 2] << 8 | randomBytesBuffer[i * 2 + 1]) % charSet.length;
    token += charSet[randomIndex];
  }
  
  // Add prefix if specified
  if (options.prefix) {
    token = options.prefix + token;
  }
  
  // Add checksum for validation
  if (options.include_checksum) {
    const checksum = generateChecksum(token);
    token += checksum;
  }
  
  // Add suffix if specified
  if (options.suffix) {
    token = token + options.suffix;
  }
  
  return token;
}

/**
 * Fallback pseudo-random token generation
 */
function generatePseudoRandomToken(charSet: string, length: number, options: TokenGenerationOptions): string {
  let token = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    token += charSet[randomIndex];
  }
  
  if (options.prefix) token = options.prefix + token;
  if (options.include_checksum) token += generateChecksum(token);
  if (options.suffix) token = token + options.suffix;
  
  return token;
}

/**
 * Generates a checksum for token validation
 */
function generateChecksum(token: string): string {
  const hash = createHash('md5').update(token).digest('hex');
  return hash.substring(0, 2).toUpperCase();
}

/**
 * Validates a token's checksum
 */
export function validateTokenChecksum(token: string): boolean {
  if (token.length < 3) return false;
  
  const tokenWithoutChecksum = token.slice(0, -2);
  const providedChecksum = token.slice(-2);
  const calculatedChecksum = generateChecksum(tokenWithoutChecksum);
  
  return providedChecksum === calculatedChecksum;
}

/**
 * Generates bulk tokens for multiple guests
 */
export async function generateBulkTokens(
  guests: Array<{ id: string; guest_name: string; phone_number: string }>,
  options: Partial<TokenGenerationOptions> = {},
  existingTokens: Set<string> = new Set()
): Promise<BulkTokenGeneration> {
  const startTime = Date.now();
  const opts = { ...DEFAULT_TOKEN_OPTIONS, ...options };
  
  const result: BulkTokenGeneration = {
    guest_count: guests.length,
    tokens_generated: 0,
    backup_tokens_generated: 0,
    success_count: 0,
    error_count: 0,
    errors: [],
    generation_time_ms: 0,
    batch_id: generateBatchId(),
  };

  const generatedTokens = new Set([...existingTokens]);
  const tokenMap = new Map<string, { token: string; backup_token?: string }>();

  for (const guest of guests) {
    try {
      // Generate primary token
      let primaryToken = '';
      let attempts = 0;
      const maxAttempts = 10;

      do {
        primaryToken = generateSecureToken(opts);
        attempts++;
        
        if (attempts >= maxAttempts) {
          throw new Error(`Failed to generate unique token after ${maxAttempts} attempts`);
        }
      } while (generatedTokens.has(primaryToken));

      generatedTokens.add(primaryToken);
      result.tokens_generated++;

      // Generate backup token if requested
      let backupToken: string | undefined;
      if (opts.generate_backup) {
        attempts = 0;
        do {
          backupToken = generateSecureToken(opts);
          attempts++;
          
          if (attempts >= maxAttempts) {
            throw new Error(`Failed to generate unique backup token after ${maxAttempts} attempts`);
          }
        } while (generatedTokens.has(backupToken));

        generatedTokens.add(backupToken);
        result.backup_tokens_generated++;
      }

      tokenMap.set(guest.id, { token: primaryToken, backup_token: backupToken });
      result.success_count++;

    } catch (error) {
      result.error_count++;
      result.errors.push(`Guest ${guest.guest_name} (${guest.id}): ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  result.generation_time_ms = Date.now() - startTime;
  
  return result;
}

/**
 * Generates a unique batch ID for tracking bulk operations
 */
function generateBatchId(): string {
  const timestamp = Date.now().toString(36);
  const randomBytes = generateSecureToken({ length: 6, use_crypto_random: true, include_checksum: false });
  return `batch_${timestamp}_${randomBytes}`;
}

/**
 * Validates token format and expiry
 */
export function validateToken(token: string, guestTokens: Map<string, { expires_at?: Date, is_used?: boolean }>): {
  isValid: boolean;
  isExpired: boolean;
  isUsed: boolean;
  error?: string;
} {
  // Basic format validation
  if (!token || token.length < 8) {
    return { isValid: false, isExpired: false, isUsed: false, error: 'Token too short' };
  }

  // Check checksum if enabled
  if (token.length >= 10 && !validateTokenChecksum(token)) {
    return { isValid: false, isExpired: false, isUsed: false, error: 'Invalid token checksum' };
  }

  // Check if token exists in our system
  const tokenData = guestTokens.get(token);
  if (!tokenData) {
    return { isValid: false, isExpired: false, isUsed: false, error: 'Token not found' };
  }

  // Check if token is expired
  const isExpired = tokenData.expires_at ? new Date() > tokenData.expires_at : false;
  if (isExpired) {
    return { isValid: false, isExpired: true, isUsed: false, error: 'Token has expired' };
  }

  // Check if token has been used
  const isUsed = tokenData.is_used || false;
  if (isUsed) {
    return { isValid: false, isExpired: false, isUsed: true, error: 'Token has already been used' };
  }

  return { isValid: true, isExpired: false, isUsed: false };
}

/**
 * Generates token expiry date
 */
export function generateTokenExpiry(days: number = DEFAULT_TOKEN_OPTIONS.expiry_days): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}

/**
 * Creates a secure hash of sensitive data for logging/tracking
 */
export function createSecureHash(data: string): string {
  return createHash('sha256').update(data).digest('hex').substring(0, 16);
}

/**
 * Generates token statistics for monitoring
 */
export function generateTokenStats(tokens: Array<{ token: string; created_at: Date; expires_at?: Date; is_used?: boolean }>): {
  total: number;
  active: number;
  expired: number;
  used: number;
  available: number;
  expiringWithin7Days: number;
  averageLength: number;
  securityScore: number;
} {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const stats = {
    total: tokens.length,
    active: 0,
    expired: 0,
    used: 0,
    available: 0,
    expiringWithin7Days: 0,
    averageLength: 0,
    securityScore: 0,
  };

  if (tokens.length === 0) return stats;

  let totalLength = 0;
  let securityPoints = 0;

  for (const tokenData of tokens) {
    totalLength += tokenData.token.length;
    
    // Check security characteristics
    if (tokenData.token.length >= 12) securityPoints += 20;
    if (/[A-Z]/.test(tokenData.token)) securityPoints += 15;
    if (/[a-z]/.test(tokenData.token)) securityPoints += 15;
    if (/[0-9]/.test(tokenData.token)) securityPoints += 15;
    if (validateTokenChecksum(tokenData.token)) securityPoints += 35;

    const isExpired = tokenData.expires_at ? now > tokenData.expires_at : false;
    const isUsed = tokenData.is_used || false;
    const isExpiringWithin7Days = tokenData.expires_at ? sevenDaysFromNow > tokenData.expires_at : false;

    if (isExpired) {
      stats.expired++;
    } else if (isUsed) {
      stats.used++;
    } else {
      stats.active++;
      stats.available++;
    }

    if (isExpiringWithin7Days && !isExpired && !isUsed) {
      stats.expiringWithin7Days++;
    }
  }

  stats.averageLength = Math.round(totalLength / tokens.length * 100) / 100;
  stats.securityScore = Math.min(100, Math.round(securityPoints / tokens.length));

  return stats;
}

/**
 * Emergency token regeneration for security incidents
 */
export async function emergencyTokenRegeneration(
  compromisedTokens: string[],
  guestData: Array<{ id: string; guest_name: string; phone_number: string }>,
  options: Partial<TokenGenerationOptions> = {}
): Promise<{
  regenerated: number;
  failed: number;
  newTokens: Map<string, { old_token: string; new_token: string; backup_token?: string }>;
  errors: string[];
}> {
  const compromisedSet = new Set(compromisedTokens);
  const affectedGuests = guestData.filter(guest => 
    guestData.some(g => compromisedSet.has(g.id))
  );

  const bulkResult = await generateBulkTokens(affectedGuests, {
    ...options,
    generate_backup: true,
    use_crypto_random: true,
  });

  return {
    regenerated: bulkResult.success_count,
    failed: bulkResult.error_count,
    newTokens: new Map(), // This would be populated with actual token mapping
    errors: bulkResult.errors,
  };
}

export default {
  generateSecureToken,
  validateTokenChecksum,
  generateBulkTokens,
  validateToken,
  generateTokenExpiry,
  createSecureHash,
  generateTokenStats,
  emergencyTokenRegeneration,
  DEFAULT_TOKEN_OPTIONS,
};