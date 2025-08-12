// Guest name mapping from tokens
export const getGuestNameFromToken = (token: string): string => {
  if (!token) return '';
  
  // Extract guest ID from token (first part before first dot)
  const guestId = token.split('.')[0];
  
  // Convert token format to readable name
  // e.g., "jamie-test" -> "Jamie Test"
  if (guestId) {
    return guestId
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
  
  return '';
};

// Check if token appears to be valid format
export const isValidTokenFormat = (token: string): boolean => {
  if (!token) return false;
  
  // Should have format: guestId.timestamp.signature
  const parts = token.split('.');
  return parts.length === 3 && parts[0].length > 0;
};