// Simple guest token mapping for auto-populating names
// Real guest tokens will be generated and stored in database
export const guestTokenMap: { [token: string]: string } = {
  // Real wedding guest tokens
  'JAMIE-SOHFWI': 'Jamie',
  // Sample tokens for testing
  'JAMIE-HUL04J83': 'Jamie Smith',
  'test-token': 'Test Guest',
  'demo-123': 'Demo User'
};

export function getGuestNameFromToken(token: string): string {
  // Return the mapped name, or extract a readable name from the token
  if (guestTokenMap[token]) {
    return guestTokenMap[token];
  }
  
  // If no mapping found, try to extract name from token format
  const parts = token.split('-');
  if (parts.length >= 1) {
    // Convert "JAMIE" to "Jamie"
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  }
  
  return ''; // Return empty string if can't determine name
}

export function isValidToken(token: string): boolean {
  // For now, accept any token that's at least 3 characters
  // This allows guests to use the form even without specific token mapping
  return token && token.length >= 3;
}