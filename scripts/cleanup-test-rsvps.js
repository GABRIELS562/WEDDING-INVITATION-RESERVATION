// Script to clean up test RSVPs from the database
// Run with: node scripts/cleanup-test-rsvps.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wldydpwjsmsqtehdwxvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZHlkcHdqc21zcXRlaGR3eHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjAyMDEsImV4cCI6MjA3MDczNjIwMX0.RMFQ7sqEOJEtMjLcYY8c9_5A95kKY63zeIyZWkWdTSU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupTestRSVPs() {
  console.log('🧹 Starting cleanup of test RSVPs...\n');
  
  try {
    // First, show all Jaime/Jamie RSVPs
    console.log('📋 Finding all test RSVPs with "Jaime" or "Jamie"...');
    const { data: rsvps, error: fetchError } = await supabase
      .from('rsvps')
      .select('*')
      .or('guest_name.ilike.%jaime%,guest_name.ilike.%jamie%');
    
    if (fetchError) {
      console.error('❌ Error fetching RSVPs:', fetchError);
      return;
    }
    
    if (!rsvps || rsvps.length === 0) {
      console.log('✅ No test RSVPs found. Database is clean!');
      return;
    }
    
    console.log(`\n🔍 Found ${rsvps.length} test RSVP(s):\n`);
    rsvps.forEach((rsvp, index) => {
      console.log(`${index + 1}. Guest: ${rsvp.guest_name}`);
      console.log(`   Token: ${rsvp.guest_token}`);
      console.log(`   Date: ${rsvp.created_at || rsvp.submitted_at}`);
      console.log(`   ID: ${rsvp.id}\n`);
    });
    
    // Ask for confirmation (in a real script, you'd use readline)
    console.log('⚠️  To delete these entries, uncomment the deletion code below\n');
    
    // UNCOMMENT THESE LINES TO ACTUALLY DELETE:
    /*
    console.log('🗑️  Deleting test RSVPs...');
    const { error: deleteError } = await supabase
      .from('rsvps')
      .delete()
      .or('guest_name.ilike.%jaime%,guest_name.ilike.%jamie%');
    
    if (deleteError) {
      console.error('❌ Error deleting RSVPs:', deleteError);
    } else {
      console.log('✅ Successfully deleted all test RSVPs!');
    }
    */
    
    // Also clean up test guests
    console.log('📋 Finding test guests...');
    const { data: guests, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .or('guest_name.ilike.%jaime%,guest_name.ilike.%jamie%,guest_token.like.JAIME--%');
    
    if (guests && guests.length > 0) {
      console.log(`\n🔍 Found ${guests.length} test guest(s):\n`);
      guests.forEach((guest, index) => {
        console.log(`${index + 1}. Guest: ${guest.guest_name}`);
        console.log(`   Token: ${guest.guest_token || guest.unique_token}`);
        console.log(`   ID: ${guest.id}\n`);
      });
      
      // UNCOMMENT TO DELETE GUESTS TOO:
      /*
      console.log('🗑️  Deleting test guests...');
      const { error: deleteGuestError } = await supabase
        .from('guests')
        .delete()
        .or('guest_name.ilike.%jaime%,guest_name.ilike.%jamie%,guest_token.like.JAIME--%');
      
      if (!deleteGuestError) {
        console.log('✅ Successfully deleted all test guests!');
      }
      */
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the cleanup
cleanupTestRSVPs();