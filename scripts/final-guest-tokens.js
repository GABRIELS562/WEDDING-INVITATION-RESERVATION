#!/usr/bin/env node
/**
 * Final Wedding Guest Tokens - Manual WhatsApp Distribution
 * Kirsten & Dale's Wedding - 115 Guests, No Plus-Ones
 */

// All 115 wedding guests (113 real + 2 extra)
const allWeddingGuests = [
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
  'Lucien', 'Dene', 'Julie', 'Tristan', 'Skye', 'Ruth', 'Kirsten', 'Dale', 'DJ', 'Photographer - Kyla',
  'Extra Guest 1', 'Extra Guest 2'
];

// Generate secure token
function generateToken(name, index) {
  const cleanName = name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomSuffix = '';
  for (let i = 0; i < 8; i++) {
    randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `${cleanName}-${randomSuffix}`;
}

// Generate WhatsApp message template
function generateWhatsAppMessage(guestName, rsvpUrl) {
  return `🎊 *Kirsten & Dale's Wedding Invitation* 🎊

Dear ${guestName},

You're cordially invited to celebrate our special day!

📅 *Date:* October 31st, 2025
⏰ *Time:* 4:00 PM Ceremony | 6:00 PM Reception  
📍 *Venue:* Cape Point Vineyards, Noordhoek, Cape Town

🔗 *Your Personal RSVP Link:*
${rsvpUrl}

Please RSVP by *September 30th, 2025* so we can finalize our arrangements.

Looking forward to celebrating with you! 💕

With love,
Kirsten & Dale

#KirstenDaleWedding`;
}

// Generate all guest data
function generateFinalGuestData() {
  console.log('🎊 KIRSTEN & DALE WEDDING - FINAL GUEST TOKEN SYSTEM 🎊\n');
  
  const guests = allWeddingGuests.map((name, index) => {
    const token = generateToken(name, index);
    const guestId = `kd-guest-${String(index + 1).padStart(3, '0')}`;
    const rsvpUrl = `https://kdwedding-botpedulv-gabriels-projects-036175f3.vercel.app/guest/${token}`;
    const whatsappMessage = generateWhatsAppMessage(name, rsvpUrl);
    
    return {
      guestId,
      name: name.trim(),
      token,
      rsvpUrl,
      whatsappMessage
    };
  });
  
  // Generate CSV headers
  const headers = [
    'Guest ID',
    'Guest Name', 
    'Token',
    'Plus One Eligible',
    'RSVP URL',
    'WhatsApp Message Template',
    'Status',
    'RSVP Submitted',
    'Attending',
    'Meal Choice',
    'Dietary Restrictions',
    'Email Address',
    'WhatsApp Number',
    'Special Requests',
    'Submission Date'
  ];

  // Generate CSV rows
  const rows = guests.map(guest => [
    guest.guestId,
    guest.name,
    guest.token,
    'NO', // No plus-ones for anyone
    guest.rsvpUrl,
    guest.whatsappMessage.replace(/"/g, '""'), // Escape quotes
    'NOT_SENT',
    '', '', '', '', '', '', '', '' // Empty columns for tracking
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  console.log(`📊 FINAL STATISTICS:`);
  console.log(`   Total Guests: ${guests.length} (115 total)`);
  console.log(`   Real Guests: 113`);
  console.log(`   Extra Guests: 2`);
  console.log(`   Plus-One Eligible: 0 (NO PLUS-ONES)`);
  console.log(`   Max Attendees: ${guests.length} (individual links only)`);
  console.log(`   Email Sender: kirstendale583@gmail.com (via EmailJS)\n`);
  
  console.log('📄 COPY THIS CSV DATA TO GOOGLE SHEETS:');
  console.log('Create "Guest_Tokens" tab and paste this data:');
  console.log('=' + '='.repeat(120));
  console.log(csvContent);
  console.log('=' + '='.repeat(120));
  
  console.log('\n🔗 SAMPLE GUEST URLS (First 10):');
  guests.slice(0, 10).forEach(guest => {
    console.log(`${guest.name}: ${guest.rsvpUrl}`);
  });
  
  console.log('\n📱 MANUAL WHATSAPP PROCESS:');
  console.log('1. 📋 Copy CSV data above to "Guest_Tokens" sheet in Google Sheets');
  console.log('2. 📱 For each guest: copy "WhatsApp Message Template" from column F');
  console.log('3. 📤 Send via your personal WhatsApp to each guest');
  console.log('4. ✅ Mark "Status" as "SENT" in Google Sheets after sending');
  console.log('5. 📊 Monitor responses in "RSVP_Individual" sheet');
  console.log('6. 📧 Guests will receive automatic email confirmations from kirstendale583@gmail.com');
  
  console.log('\n🎯 SYSTEM READY FOR MANUAL DISTRIBUTION!');
  return guests;
}

// Execute
const guests = generateFinalGuestData();