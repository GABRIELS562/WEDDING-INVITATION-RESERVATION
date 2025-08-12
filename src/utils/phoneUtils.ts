/**
 * Phone number utilities for South African numbers
 */

/**
 * Normalize South African phone number from 0722... to +27722...
 */
export function normalizePhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // If it starts with 0, replace with +27
  if (cleaned.startsWith('0')) {
    cleaned = '+27' + cleaned.substring(1);
  }
  
  // If it doesn't start with +, assume it's missing country code
  if (!cleaned.startsWith('+')) {
    cleaned = '+27' + cleaned;
  }
  
  return cleaned;
}

/**
 * Format phone number for display (keep original format)
 */
export function formatPhoneForDisplay(phoneNumber: string): string {
  if (!phoneNumber) return '';
  
  // Keep the original format for display
  return phoneNumber;
}

/**
 * Validate South African phone number format
 */
export function isValidSAPhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber) return false;
  
  const normalized = normalizePhoneNumber(phoneNumber);
  
  // South African mobile numbers: +27 followed by 6, 7, 8, or 9, then 8 digits
  const saPhoneRegex = /^\+27[6-9]\d{8}$/;
  
  return saPhoneRegex.test(normalized);
}

export default {
  normalizePhoneNumber,
  formatPhoneForDisplay,
  isValidSAPhoneNumber
};