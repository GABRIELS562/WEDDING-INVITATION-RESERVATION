/**
 * Secure Token Generation System
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Crypto-secure token generation with validation and backup systems
 */

import { TokenGenerationOptions, BulkTokenGeneration, WhatsAppGuest } from '@/types/whatsapp';

class TokenGenerator {
  private readonly SECURE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes similar chars: 0,O,1,I
  private readonly ALL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private readonly DEFAULT_OPTIONS: TokenGenerationOptions = {
    length: 12,
    use_crypto_random: true,
    include_checksum: true,
    expiry_days: 60,
    generate_backup: true,
    exclude_similar_chars: true
  };

  /**
   * Generate a single secure token
   */
  generateToken(options: Partial<TokenGenerationOptions> = {}): string {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    try {
      // Choose character set
      const charset = config.exclude_similar_chars ? this.SECURE_CHARS : this.ALL_CHARS;
      
      // Calculate token length (reserve space for checksum if needed)
      const tokenLength = config.include_checksum ? config.length - 2 : config.length;
      
      let token = '';
      
      if (config.use_crypto_random && typeof window !== 'undefined' && window.crypto) {
        // Use crypto-secure random generation
        const array = new Uint8Array(tokenLength);
        window.crypto.getRandomValues(array);
        
        token = Array.from(array, byte => charset[byte % charset.length]).join('');
      } else {
        // Fallback to Math.random (less secure but works in all environments)
        for (let i = 0; i < tokenLength; i++) {
          token += charset[Math.floor(Math.random() * charset.length)];
        }
      }
      
      // Add prefix if specified
      if (config.prefix) {
        token = config.prefix + token;
      }
      
      // Add checksum if requested
      if (config.include_checksum) {
        const checksum = this.calculateChecksum(token);
        token += checksum;
      }
      
      return token;
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Failed to generate secure token');
    }
  }

  /**
   * Generate multiple tokens in bulk
   */
  async generateBulkTokens(
    guestCount: number, 
    options: Partial<TokenGenerationOptions> = {}
  ): Promise<BulkTokenGeneration> {
    const startTime = performance.now();
    const batchId = this.generateBatchId();
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    const result: BulkTokenGeneration = {
      guest_count: guestCount,
      tokens_generated: 0,
      backup_tokens_generated: 0,
      success_count: 0,
      error_count: 0,
      errors: [],
      generation_time_ms: 0,
      batch_id: batchId
    };

    try {
      const tokens = new Set<string>(); // Ensure uniqueness
      const backupTokens = new Set<string>();

      // Generate primary tokens
      while (tokens.size < guestCount) {
        try {
          const token = this.generateToken(config);
          
          // Ensure uniqueness
          if (!tokens.has(token)) {
            tokens.add(token);
            result.tokens_generated++;
            result.success_count++;
          }
        } catch (error) {
          result.error_count++;
          result.errors.push(`Token generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Prevent infinite loop
          if (result.error_count > 10) {
            throw new Error('Too many token generation failures');
          }
        }
      }

      // Generate backup tokens if requested
      if (config.generate_backup) {
        while (backupTokens.size < guestCount) {
          try {
            const backupToken = this.generateToken(config);
            
            // Ensure uniqueness (different from primary tokens and other backups)
            if (!tokens.has(backupToken) && !backupTokens.has(backupToken)) {
              backupTokens.add(backupToken);
              result.backup_tokens_generated++;
            }
          } catch (error) {
            result.error_count++;
            result.errors.push(`Backup token generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

      result.generation_time_ms = performance.now() - startTime;
      
      return result;
    } catch (error) {
      result.error_count++;
      result.errors.push(`Bulk generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.generation_time_ms = performance.now() - startTime;
      
      return result;
    }
  }

  /**
   * Validate token format and checksum
   */
  validateToken(token: string, options: Partial<TokenGenerationOptions> = {}): {
    isValid: boolean;
    errors: string[];
    metadata: {
      length: number;
      hasChecksum: boolean;
      hasPrefix: boolean;
      charset: 'secure' | 'all';
    };
  } {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    const errors: string[] = [];
    
    const metadata = {
      length: token.length,
      hasChecksum: false,
      hasPrefix: Boolean(config.prefix && token.startsWith(config.prefix)),
      charset: 'secure' as 'secure' | 'all'
    };

    // Basic length validation
    if (token.length < 8) {
      errors.push('Token too short (minimum 8 characters)');
    }
    
    if (token.length > 32) {
      errors.push('Token too long (maximum 32 characters)');
    }

    // Character set validation
    const charset = config.exclude_similar_chars ? this.SECURE_CHARS : this.ALL_CHARS;
    let cleanToken = token;
    
    // Remove prefix if present
    if (config.prefix && token.startsWith(config.prefix)) {
      cleanToken = token.substring(config.prefix.length);
    }
    
    // Check for invalid characters
    for (const char of cleanToken) {
      if (!charset.includes(char)) {
        errors.push(`Invalid character '${char}' in token`);
        metadata.charset = 'all';
      }
    }

    // Checksum validation
    if (config.include_checksum) {
      if (cleanToken.length < 3) {
        errors.push('Token too short to contain checksum');
      } else {
        const tokenPart = cleanToken.slice(0, -2);
        const checksumPart = cleanToken.slice(-2);
        const expectedChecksum = this.calculateChecksum(tokenPart);
        
        metadata.hasChecksum = true;
        
        if (checksumPart !== expectedChecksum) {
          errors.push('Invalid token checksum');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      metadata
    };
  }

  /**
   * Generate tokens for specific guests
   */
  async generateGuestTokens(
    guests: Array<{ id: string; guest_name: string }>,
    options: Partial<TokenGenerationOptions> = {}
  ): Promise<Array<{ guestId: string; token: string; backupToken?: string }>> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    const results: Array<{ guestId: string; token: string; backupToken?: string }> = [];
    const usedTokens = new Set<string>();

    for (const guest of guests) {
      try {
        // Generate primary token
        let token: string;
        let attempts = 0;
        
        do {
          token = this.generateToken(config);
          attempts++;
          
          if (attempts > 10) {
            throw new Error('Unable to generate unique token after 10 attempts');
          }
        } while (usedTokens.has(token));
        
        usedTokens.add(token);
        
        const result: { guestId: string; token: string; backupToken?: string } = {
          guestId: guest.id,
          token
        };

        // Generate backup token if requested
        if (config.generate_backup) {
          let backupToken: string;
          let backupAttempts = 0;
          
          do {
            backupToken = this.generateToken(config);
            backupAttempts++;
            
            if (backupAttempts > 10) {
              console.warn(`Unable to generate unique backup token for guest ${guest.guest_name}`);
              break;
            }
          } while (usedTokens.has(backupToken));
          
          if (backupAttempts <= 10) {
            usedTokens.add(backupToken);
            result.backupToken = backupToken;
          }
        }

        results.push(result);
      } catch (error) {
        console.error(`Failed to generate token for guest ${guest.guest_name}:`, error);
      }
    }

    return results;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(tokenCreatedAt: string, expiryDays: number = 60): boolean {
    const createdDate = new Date(tokenCreatedAt);
    const expiryDate = new Date(createdDate.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    return new Date() > expiryDate;
  }

  /**
   * Generate a new token to replace an expired one
   */
  async refreshToken(
    oldToken: string, 
    options: Partial<TokenGenerationOptions> = {}
  ): Promise<{ newToken: string; backupToken?: string }> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    // Generate new primary token
    const newToken = this.generateToken(config);
    
    const result: { newToken: string; backupToken?: string } = { newToken };
    
    // Generate backup if requested
    if (config.generate_backup) {
      result.backupToken = this.generateToken(config);
    }
    
    return result;
  }

  /**
   * Get token security level
   */
  getSecurityLevel(token: string): 'high' | 'medium' | 'low' {
    const validation = this.validateToken(token);
    
    if (!validation.isValid) return 'low';
    
    const { length, hasChecksum } = validation.metadata;
    
    if (length >= 12 && hasChecksum) return 'high';
    if (length >= 10) return 'medium';
    return 'low';
  }

  /**
   * Generate statistical analysis of token batch
   */
  analyzeTokenBatch(tokens: string[]): {
    uniqueCount: number;
    averageLength: number;
    securityDistribution: { high: number; medium: number; low: number };
    characterDistribution: { [key: string]: number };
    duplicates: string[];
  } {
    const uniqueTokens = new Set(tokens);
    const duplicates = tokens.filter((token, index) => tokens.indexOf(token) !== index);
    
    const securityDistribution = { high: 0, medium: 0, low: 0 };
    const characterDistribution: { [key: string]: number } = {};
    
    let totalLength = 0;
    
    tokens.forEach(token => {
      totalLength += token.length;
      
      // Security analysis
      const security = this.getSecurityLevel(token);
      securityDistribution[security]++;
      
      // Character frequency analysis
      for (const char of token) {
        characterDistribution[char] = (characterDistribution[char] || 0) + 1;
      }
    });

    return {
      uniqueCount: uniqueTokens.size,
      averageLength: totalLength / tokens.length,
      securityDistribution,
      characterDistribution,
      duplicates: Array.from(new Set(duplicates))
    };
  }

  // Private helper methods

  private calculateChecksum(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to positive number and format as 2-digit hex
    const positiveHash = Math.abs(hash);
    const checksum = (positiveHash % 1296).toString(36).toUpperCase().padStart(2, '0');
    
    return checksum.length > 2 ? checksum.substring(0, 2) : checksum;
  }

  private generateBatchId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `BATCH_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Generate test tokens for development
   */
  generateTestTokens(count: number = 10): string[] {
    const tokens: string[] = [];
    const options: TokenGenerationOptions = {
      ...this.DEFAULT_OPTIONS,
      length: 10,
      use_crypto_random: false, // Use deterministic generation for testing
      prefix: 'TEST_'
    };

    for (let i = 0; i < count; i++) {
      tokens.push(this.generateToken(options));
    }

    return tokens;
  }

  /**
   * Validate phone number format for WhatsApp
   */
  validatePhoneNumber(phoneNumber: string): {
    isValid: boolean;
    cleanNumber: string;
    countryCode?: string;
    formattedNumber: string;
    errors: string[];
  } {
    const errors: string[] = [];
    
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Basic validation
    if (cleanNumber.length < 10) {
      errors.push('Phone number too short (minimum 10 digits)');
    }
    
    if (cleanNumber.length > 15) {
      errors.push('Phone number too long (maximum 15 digits)');
    }
    
    // Check for valid international format
    let countryCode: string | undefined;
    let formattedNumber = cleanNumber;
    
    if (cleanNumber.startsWith('27') && cleanNumber.length === 11) {
      // South African number
      countryCode = '27';
      formattedNumber = `+27 ${cleanNumber.substring(2, 4)} ${cleanNumber.substring(4, 7)} ${cleanNumber.substring(7)}`;
    } else if (cleanNumber.startsWith('1') && cleanNumber.length === 11) {
      // US/Canada number
      countryCode = '1';
      formattedNumber = `+1 ${cleanNumber.substring(1, 4)} ${cleanNumber.substring(4, 7)} ${cleanNumber.substring(7)}`;
    } else if (cleanNumber.length === 10 && !cleanNumber.startsWith('0')) {
      // Assume US number without country code
      countryCode = '1';
      formattedNumber = `+1 ${cleanNumber.substring(0, 3)} ${cleanNumber.substring(3, 6)} ${cleanNumber.substring(6)}`;
    } else if (cleanNumber.startsWith('0') && cleanNumber.length === 10) {
      // Local South African format
      countryCode = '27';
      const withoutLeadingZero = cleanNumber.substring(1);
      formattedNumber = `+27 ${withoutLeadingZero.substring(0, 2)} ${withoutLeadingZero.substring(2, 5)} ${withoutLeadingZero.substring(5)}`;
    }
    
    if (!countryCode) {
      errors.push('Unable to determine country code');
    }

    return {
      isValid: errors.length === 0,
      cleanNumber: countryCode ? cleanNumber : cleanNumber,
      countryCode,
      formattedNumber,
      errors
    };
  }
}

// Export singleton instance
export const tokenGenerator = new TokenGenerator();
export default tokenGenerator;