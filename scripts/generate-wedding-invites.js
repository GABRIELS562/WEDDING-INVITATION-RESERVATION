#!/usr/bin/env node
/**
 * Wedding Invitation Generator - WhatsApp & RSVP URLs
 * Kirsten & Dale's Wedding - October 31st, 2025
 */

import { whatsappInviteService } from '../src/utils/whatsappInviteService.js';
import { individualGuests } from '../src/data/individualGuests.js';
import fs from 'fs';
import path from 'path';

// Generate all invitation data
function generateWeddingInvitations() {
  console.log('🎊 KIRSTEN & DALE WEDDING - INVITATION GENERATOR 🎊\n');
  
  const realGuests = individualGuests.filter(guest => guest.id !== 'jamie-test');
  const inviteData = whatsappInviteService.generateBulkInviteData();
  
  console.log(`📊 GUEST STATISTICS:`);
  console.log(`   Total Guests: ${realGuests.length}`);
  console.log(`   With Plus-One: ${realGuests.filter(g => g.plusOneEligible).length}`);
  console.log(`   Without Plus-One: ${realGuests.filter(g => !g.plusOneEligible).length}`);
  console.log(`   Max Possible Attendees: ${realGuests.reduce((sum, g) => sum + (g.plusOneEligible ? 2 : 1), 0)}\n`);
  
  // Generate CSV file for bulk management
  const csvContent = whatsappInviteService.generateBulkInviteCSV();
  const csvPath = path.join(process.cwd(), 'wedding-invitations.csv');
  fs.writeFileSync(csvPath, csvContent);
  console.log(`📄 CSV file saved: ${csvPath}\n`);
  
  // Show sample invitations
  console.log('📱 SAMPLE WHATSAPP INVITATIONS:\n');
  inviteData.slice(0, 5).forEach((invite, index) => {
    console.log(`${index + 1}. ${invite.guest.fullName}:`);
    console.log(`   Token: ${invite.guest.token}`);
    console.log(`   RSVP URL: ${invite.rsvpUrl}`);
    console.log(`   WhatsApp URL: ${invite.whatsappUrl.substring(0, 100)}...`);
    console.log('');
  });
  
  // Show Jamie's test URL
  const jamieGuest = individualGuests.find(g => g.id === 'jamie-test');
  if (jamieGuest) {
    console.log('🧪 TEST GUEST URL (Jamie):');
    console.log(`   RSVP URL: https://kdwedding-1703zt7fk-gabriels-projects-036175f3.vercel.app/guest/${jamieGuest.token}\n`);
  }
  
  console.log('✅ NEXT STEPS:');
  console.log('1. 📋 Open the generated CSV file to see all guest data');
  console.log('2. 📱 Use WhatsApp URLs to send personal invitations');
  console.log('3. 🔗 Share individual RSVP URLs via WhatsApp/SMS');
  console.log('4. 📊 Monitor responses in your Google Sheets');
  console.log('5. 🧪 Test the system using Jamie\'s URL first\n');
  
  console.log('🎯 FOR IMMEDIATE TESTING:');
  console.log(`Visit: https://kdwedding-1703zt7fk-gabriels-projects-036175f3.vercel.app/guest/${jamieGuest?.token}\n`);
  
  console.log('🎊 Wedding invitation system ready! 🎊');
}

// Export guest URLs for easy access
function exportGuestUrls() {
  const allUrls = whatsappInviteService.generateAllGuestUrls();
  const urlsContent = allUrls
    .map(guest => `${guest.name}: ${guest.rsvpUrl}`)
    .join('\n');
  
  const urlsPath = path.join(process.cwd(), 'guest-rsvp-urls.txt');
  fs.writeFileSync(urlsPath, urlsContent);
  console.log(`🔗 Guest URLs saved: ${urlsPath}`);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  generateWeddingInvitations();
  exportGuestUrls();
}