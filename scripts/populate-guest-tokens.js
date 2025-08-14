#!/usr/bin/env node
/**
 * Populate Google Sheets with Guest Tokens
 * This script adds all guest tokens to the Google Sheet for easy management
 */

import { individualGuests } from '../src/data/individualGuests.js';

// Generate CSV content for Google Sheets
function generateGuestTokenCSV() {
  const headers = [
    'Guest ID',
    'Full Name', 
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Token',
    'Plus One Eligible',
    'Plus One Name',
    'Invitation Group',
    'Dietary Restrictions',
    'Special Notes',
    'RSVP URL',
    'Status'
  ];

  const rows = individualGuests.map(guest => [
    guest.id,
    guest.fullName,
    guest.firstName,
    guest.lastName,
    guest.email || '',
    guest.phone || '',
    guest.token,
    guest.plusOneEligible ? 'YES' : 'NO',
    guest.plusOneName || '',
    guest.invitationGroup || '',
    (guest.dietaryRestrictions || []).join(', '),
    guest.specialNotes || '',
    `https://kdwedding-1703zt7fk-gabriels-projects-036175f3.vercel.app/guest/${guest.token}`,
    'NOT_SENT'
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return csvContent;
}

// Generate guest summary
function generateGuestSummary() {
  const total = individualGuests.length;
  const withPlusOne = individualGuests.filter(g => g.plusOneEligible).length;
  const groups = individualGuests.reduce((acc, guest) => {
    const group = guest.invitationGroup || 'other';
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    withPlusOne,
    withoutPlusOne: total - withPlusOne,
    maxPossibleAttendees: individualGuests.reduce((sum, guest) => 
      sum + (guest.plusOneEligible ? 2 : 1), 0),
    byGroup: groups
  };
}

// Main execution
console.log('🎊 KIRSTEN & DALE WEDDING - GUEST TOKEN GENERATOR 🎊\n');

const csv = generateGuestTokenCSV();
const summary = generateGuestSummary();

console.log('📊 GUEST SUMMARY:');
console.log(`Total Guests: ${summary.total}`);
console.log(`With Plus-One: ${summary.withPlusOne}`);
console.log(`Without Plus-One: ${summary.withoutPlusOne}`);
console.log(`Max Possible Attendees: ${summary.maxPossibleAttendees}`);
console.log('\n📋 BY INVITATION GROUP:');
Object.entries(summary.byGroup).forEach(([group, count]) => {
  console.log(`  ${group}: ${count} guests`);
});

console.log('\n📄 CSV DATA (Copy to Google Sheets):');
console.log('=' + '='.repeat(80));
console.log(csv);
console.log('=' + '='.repeat(80));

console.log('\n🔗 SAMPLE GUEST URLS:');
console.log('Test these URLs to verify RSVP functionality:');
individualGuests.slice(0, 5).forEach(guest => {
  console.log(`${guest.fullName}: https://kdwedding-1703zt7fk-gabriels-projects-036175f3.vercel.app/guest/${guest.token}`);
});

console.log('\n✅ INSTRUCTIONS:');
console.log('1. Copy the CSV data above');
console.log('2. Create a new sheet called "Guest_Tokens" in your Google Sheets');
console.log('3. Paste the CSV data into the sheet');
console.log('4. Share this sheet with kirstendale583@gmail.com');
console.log('5. Test RSVP functionality using the sample URLs above');