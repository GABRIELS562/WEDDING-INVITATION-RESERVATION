import type { IndividualGuest } from '../types';

// PRIVACY NOTICE: Guest data is stored securely in Supabase database
// No personal information is hardcoded in the repository
// This file generates placeholder data only - real data comes from database

// Generate placeholder guest data for system functionality
// Real guest names and details are never exposed in the code
const generatePlaceholderGuests = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => `Guest_${String(i + 1).padStart(3, '0')}`);
};

// Use 115 placeholder guests (matching real guest count)
const realGuestNames = generatePlaceholderGuests(115);

// Generate secure token for each guest
function generateSecureToken(name: string, index: number): string {
  // Use index-based token generation to ensure uniqueness
  // Real tokens are managed in the database
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `guest-${index}-${timestamp}-${random}`;
}

// Generate all real guest data with tokens
export const generateRealWeddingGuests = (): IndividualGuest[] => {
  return realGuestNames.map((name, index) => {
    const token = generateSecureToken(name, index);
    const guestId = `kd-guest-${String(index + 1).padStart(3, '0')}`;
    
    // NO PLUS-ONES - Each guest gets their own individual link
    const plusOneEligible = false;
    
    // Parse name into first/last
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    return {
      id: guestId,
      firstName,
      lastName,
      fullName: name.trim(),
      email: '', // Will be filled when guest provides it
      phone: '', // Will be filled when guest provides it
      token,
      hasUsedToken: false,
      plusOneEligible,
      invitationGroup: index < 50 ? 'family-friends' : 'extended-family',
      createdAt: new Date('2025-01-15'),
      specialNotes: `Real wedding guest #${index + 1}`
    };
  });
};

// Export the generated guests
export const realWeddingGuests = generateRealWeddingGuests();

// Export guest token map for quick lookup
export const realGuestTokenMap = new Map<string, IndividualGuest>();
realWeddingGuests.forEach(guest => {
  realGuestTokenMap.set(guest.token, guest);
});

// Export guest statistics
export const realGuestStats = {
  total: realWeddingGuests.length,
  withPlusOne: realWeddingGuests.filter(g => g.plusOneEligible).length,
  withoutPlusOne: realWeddingGuests.filter(g => !g.plusOneEligible).length,
  maxPossibleAttendees: realWeddingGuests.reduce((total, guest) => {
    return total + (guest.plusOneEligible ? 2 : 1);
  }, 0)
};

// Export guest names for reference
export { realGuestNames };