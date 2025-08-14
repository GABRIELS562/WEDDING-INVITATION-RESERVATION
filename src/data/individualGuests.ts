import type { IndividualGuest } from '../types';
import { realWeddingGuests } from './realWeddingGuests';

// Individual guest authentication system - each guest gets their own unique token
// Format: "firstname-lastname-8randomchars"
export const individualGuests: IndividualGuest[] = [
  // Keep Jamie as test guest for development
  {
    id: 'jamie-test',
    firstName: 'Jamie',
    lastName: 'Test',
    fullName: 'Jamie',
    email: 'test@example.com',
    phone: '+27722108714',
    token: 'jamie-test-abc12345',
    hasUsedToken: false,
    plusOneEligible: false,
    invitationGroup: 'test',
    createdAt: new Date('2025-01-15'),
    specialNotes: 'Test guest for system validation'
  },
  // Add all 110 real wedding guests with unique tokens
  ...realWeddingGuests
];

// Guest lookup by token for quick authentication
export const guestTokenMap = new Map<string, IndividualGuest>();
individualGuests.forEach(guest => {
  guestTokenMap.set(guest.token, guest);
});

// Group guests by invitation category
export const guestsByGroup = individualGuests.reduce((groups, guest) => {
  const group = guest.invitationGroup || 'other';
  if (!groups[group]) {
    groups[group] = [];
  }
  groups[group].push(guest);
  return groups;
}, {} as Record<string, IndividualGuest[]>);

// Statistics
export const guestStats = {
  total: individualGuests.length,
  withPlusOne: individualGuests.filter(g => g.plusOneEligible).length,
  withoutPlusOne: individualGuests.filter(g => !g.plusOneEligible).length,
  maxPossibleAttendees: individualGuests.reduce((total, guest) => {
    return total + (guest.plusOneEligible ? 2 : 1);
  }, 0),
  byGroup: Object.keys(guestsByGroup).reduce((stats, group) => {
    stats[group] = guestsByGroup[group].length;
    return stats;
  }, {} as Record<string, number>)
};