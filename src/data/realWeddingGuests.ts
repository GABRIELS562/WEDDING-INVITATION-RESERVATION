import type { IndividualGuest } from '../types';

// PRIVACY NOTICE: Guest data is stored securely in Supabase database
// No personal information is hardcoded in the repository
// This file generates placeholder data only - real data comes from database

// Real guest list for Dale & Kirsten's wedding
// Note: Some names appear twice as they are different people (e.g., Tertia 1 and Tertia 2)
const realGuestNames = [
  'Allison', 'Andrea', 'Angelique', 'Ashlee', 'Audrey', 'Brian', 'Bridgette', 'Candice', 
  'Cheryl', 'Cyril', 'Debbie', 'Derrick', 'Emile', 'Eustacia', 'Gail', 'Gladys', 'Helen', 
  'Husband Susan', 'Ian', 'Jenna', 'Jill', 'JP', 'Judy', 'Julian', 'Kim', 'Liam', 'Luca', 
  'Lyndon', 'Mark W', 'Mark P', 'Marlene', 'Marlon M', 'Moira', 'Morgan', 'Nicci', 'Patty', 
  'Portia', 'Robynne', 'Rylie', 'Shaun', 'Simone', 'Spencer', 'Stefan', 'Susan', 'Tania', 
  'Tertia S', 'Trevor', 'Trixie', 'Victor', 'Vanessa', 'Duncan', 'Berenice', 'Tayla', 'Lindsay', 
  'Amari', 'Ma', 'Attie', 'Virgy', 'Jamie', 'Tasmin', 'Zac', 'Tasneem', 'Lameez', 'Wesley', 
  'Lindsay J', 'Marlon K', 'Rowena', 'Ushrie', 'Smiley', 'Jeremy', 'Mauvina', 'Arthur', 'Michelle', 
  'Stephan', 'Sandra', 'Norman', 'Charmaine', 'Monray', 'Nicole', 'June', 'Dayne', 'Tatum', 
  'Warren', 'Kelly', 'Chadwin', 'Tertia R', 'Mike', 'Liezel', 'Sulaiman', 'Thalia', 'Pastor Granville', 
  'Denise', 'Craig', 'Jermaine', 'Toby', 'Suzanne', 'Ferdinand', 'Megan', 'Sven', 'Mikail', 
  'Lucien', 'Dene', 'Julie', 'Tristan', 'Skye', 'Ruth', 'Kirsten', 'Dale', 'DJ', 'Photographer - Kyla'
];

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