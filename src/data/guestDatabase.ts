// Guest database with flexible name matching
export interface GuestRecord {
  id: string;
  primaryName: string;
  alternativeNames: string[];
  whatsappNumber?: string;
  email?: string;
  token: string;
  notes?: string;
}

// Guest database - you can expand this with actual guest information
export const guestDatabase: GuestRecord[] = [
  {
    id: 'jamie-test',
    primaryName: 'Jamie',
    alternativeNames: ['Jaime', 'Jamie Test', 'J', 'Jay'],
    whatsappNumber: '+27722108714',
    token: 'jamie-test.1754978658803.654a68120c58c97c',
    notes: 'Test guest for system validation'
  },
  // Add more guests here as needed
  {
    id: 'sample-guest',
    primaryName: 'John Smith',
    alternativeNames: ['John', 'Johnny', 'J Smith', 'Jonathan Smith'],
    whatsappNumber: '+27123456789',
    token: 'sample-guest.1234567890.abcd1234',
    notes: 'Sample guest entry'
  }
];

/**
 * Find guest by token
 */
export function findGuestByToken(token: string): GuestRecord | null {
  const guestId = token.split('.')[0];
  return guestDatabase.find(guest => guest.id === guestId) || null;
}

/**
 * Get primary name for token with fallback to ID conversion
 */
export function getGuestNameForToken(token: string): string {
  // First try to find in database
  const guest = findGuestByToken(token);
  if (guest) {
    return guest.primaryName;
  }
  
  // Fallback to token-based name generation
  const guestId = token.split('.')[0];
  if (guestId) {
    return guestId
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
  
  return '';
}

/**
 * Find guest by any name variation (flexible matching)
 */
export function findGuestByName(enteredName: string): GuestRecord | null {
  const normalizedInput = enteredName.toLowerCase().trim();
  
  return guestDatabase.find(guest => {
    // Check primary name
    if (guest.primaryName.toLowerCase() === normalizedInput) {
      return true;
    }
    
    // Check alternative names
    return guest.alternativeNames.some(altName => 
      altName.toLowerCase() === normalizedInput
    );
  }) || null;
}

/**
 * Get suggested names for partial matches
 */
export function getSuggestedNames(partialName: string): string[] {
  const normalizedInput = partialName.toLowerCase().trim();
  const suggestions = new Set<string>();
  
  guestDatabase.forEach(guest => {
    // Check if primary name contains the input
    if (guest.primaryName.toLowerCase().includes(normalizedInput)) {
      suggestions.add(guest.primaryName);
    }
    
    // Check alternative names
    guest.alternativeNames.forEach(altName => {
      if (altName.toLowerCase().includes(normalizedInput)) {
        suggestions.add(altName);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 5); // Limit to 5 suggestions
}

/**
 * Link entered name to existing guest record
 */
export function linkNameToGuest(enteredName: string, token: string): {
  isLinked: boolean;
  guestRecord: GuestRecord | null;
  primaryName: string;
} {
  // First try exact match
  let guestRecord = findGuestByName(enteredName);
  
  // If no exact match, try to find by token
  if (!guestRecord) {
    guestRecord = findGuestByToken(token);
  }
  
  if (guestRecord) {
    return {
      isLinked: true,
      guestRecord,
      primaryName: guestRecord.primaryName
    };
  }
  
  // No match found - use entered name as-is
  return {
    isLinked: false,
    guestRecord: null,
    primaryName: enteredName
  };
}

export default {
  guestDatabase,
  findGuestByToken,
  getGuestNameForToken,
  findGuestByName,
  getSuggestedNames,
  linkNameToGuest
};