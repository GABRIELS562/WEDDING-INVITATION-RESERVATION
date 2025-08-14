#!/usr/bin/env node
/**
 * Generate Real Guest Tokens for Kirsten & Dale's Wedding
 * Based on the actual guest list from Google Sheets
 */

// Real guest list from Google Sheets
const guestList = [
  'Allison', 'Andrea', 'Angelique', 'Ashlee', 'Audrey', 'Brian', 'Bridgette', 'Candice', 
  'Cheryl', 'Cyril', 'Debbie', 'Derrick', 'Emile', 'Eustacia', 'Gail', 'Gladys', 'Helen', 
  'Husband Susan', 'Ian', 'Jenna', 'Jill', 'JP', 'Judy', 'Julian', 'Kim', 'Liam', 'Luca', 
  'Lyndon', 'Mark W', 'Mark P', 'Marlene', 'Marlon', 'Moira', 'Morgan', 'Nicci', 'Patty', 
  'Portia', 'Robynne', 'Rylie', 'Shaun', 'Simone', 'Spencer', 'Stefan', 'Susan', 'Tania', 
  'Tertia', 'Trevor', 'Trixie', 'Victor', 'Vanessa', 'Duncan', 'Berenice', 'Tayla', 'Lindsay', 
  'Amari', 'Ma', 'Attie', 'Virgy', 'Jamie', 'Tasmin', 'Zac', 'Tasneem', 'Lameez', 'Wesley', 
  'Lindsay J', 'Marlon', 'Rowena', 'Ushrie', 'Smiley', 'Jeremy', 'Mauvina', 'Arthur', 'Michelle', 
  'Stephan', 'Sandra', 'Norman', 'Charmaine', 'Monray', 'Nicole', 'June', 'Dayne', 'Tatum', 
  'Warren', 'Kelly', 'Chadwin', 'Tertia', 'Mike', 'Liezel', 'Sulaiman', 'Thalia', 'Pastor Granville', 
  'Denise', 'Craig', 'Jermaine', 'Toby', 'Suzanne', 'Ferdinand', 'Megan', 'Sven', 'Mikail', 
  'Lucien', 'Dene', 'Julie', 'Tristan', 'Skye', 'Ruth', 'Kirsten', 'Dale', 'DJ', 'Photographer - Kyla'
];

// Generate secure random token
function generateToken(name, index) {
  const cleanName = name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  // Generate random 8-character suffix
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomSuffix = '';
  for (let i = 0; i < 8; i++) {
    randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `${cleanName}-${randomSuffix}`;
}

// Generate guest data with tokens
function generateGuestData() {
  const guests = guestList.map((name, index) => {
    const token = generateToken(name, index);
    const guestId = `kd-guest-${String(index + 1).padStart(3, '0')}`;
    
    // Determine plus-one eligibility (adults get plus-one, some exceptions)
    const plusOneEligible = !['DJ', 'Photographer - Kyla', 'Pastor Granville'].includes(name);
    
    return {
      guestId,
      name: name.trim(),
      token,
      plusOneEligible,
      rsvpUrl: `https://kdwedding-1703zt7fk-gabriels-projects-036175f3.vercel.app/guest/${token}`,
      status: 'NOT_SENT'
    };
  });
  
  return guests;
}

// Generate CSV for Google Sheets
function generateCSV(guests) {
  const headers = [
    'Guest ID',
    'Guest Name', 
    'Token',
    'Plus One Eligible',
    'RSVP URL',
    'Status',
    'RSVP Submitted',
    'Attending',
    'Meal Choice',
    'Plus One Name',
    'Plus One Meal',
    'Dietary Restrictions',
    'Email Address',
    'WhatsApp Number',
    'Special Requests',
    'Submission Date'
  ];

  const rows = guests.map(guest => [
    guest.guestId,
    guest.name,
    guest.token,
    guest.plusOneEligible ? 'YES' : 'NO',
    guest.rsvpUrl,
    guest.status,
    '', // RSVP Submitted
    '', // Attending
    '', // Meal Choice  
    '', // Plus One Name
    '', // Plus One Meal
    '', // Dietary Restrictions
    '', // Email Address
    '', // WhatsApp Number
    '', // Special Requests
    ''  // Submission Date
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return csvContent;
}

// Main execution
console.log('🎊 KIRSTEN & DALE WEDDING - REAL GUEST TOKENS 🎊\n');

const guests = generateGuestData();
const csv = generateCSV(guests);

console.log(`📊 GENERATED TOKENS FOR ${guests.length} GUESTS\n`);

console.log('📄 CSV DATA FOR GOOGLE SHEETS:');
console.log('Copy this data and paste it into a new sheet called "Guest_Tokens"');
console.log('=' + '='.repeat(100));
console.log(csv);
console.log('=' + '='.repeat(100));

console.log('\n🔗 SAMPLE GUEST URLS FOR TESTING:');
guests.slice(0, 10).forEach(guest => {
  console.log(`${guest.name}: ${guest.rsvpUrl}`);
});

console.log('\n✅ NEXT STEPS:');
console.log('1. Copy the CSV data above');
console.log('2. Open your Google Sheets');
console.log('3. Create a new sheet tab called "Guest_Tokens"');
console.log('4. Paste the CSV data (Ctrl+Shift+V for values only)');
console.log('5. Share the sheet with kirstendale583@gmail.com');
console.log('6. Test RSVP by visiting one of the sample URLs above');
console.log('\n🎯 FOR TESTING: Use Jamie\'s URL since you are a guest!');
const jamieGuest = guests.find(g => g.name.toLowerCase().includes('jamie'));
if (jamieGuest) {
  console.log(`Jamie's RSVP URL: ${jamieGuest.rsvpUrl}`);
}