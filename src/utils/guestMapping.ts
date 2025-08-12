import { getGuestNameForToken as getGuestNameFromDB } from '../data/guestDatabase';

// Guest name mapping from tokens
export const getGuestNameFromToken = (token: string): string => {
  console.log('getGuestNameFromToken called with token:', token);
  
  if (!token) {
    console.log('No token provided');
    return '';
  }
  
  // Try to get name from guest database first
  const nameFromDB = getGuestNameFromDB(token);
  console.log('Name from database:', nameFromDB);
  
  if (nameFromDB) {
    return nameFromDB;
  }
  
  // Fallback to token-based name generation
  const guestId = token.split('.')[0];
  console.log('Guest ID extracted:', guestId);
  
  if (guestId) {
    const generatedName = guestId
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    console.log('Generated name:', generatedName);
    return generatedName;
  }
  
  console.log('Could not generate name from token');
  return '';
};

// Check if token appears to be valid format
export const isValidTokenFormat = (token: string): boolean => {
  if (!token) return false;
  
  // Should have format: guestId.timestamp.signature
  const parts = token.split('.');
  return parts.length === 3 && parts[0].length > 0;
};