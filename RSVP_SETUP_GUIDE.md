# 🎉 Wedding RSVP System - Complete Setup Guide

Your wedding website now has a **fully functional RSVP system** powered by Supabase! Here's how to set it up and use it.

## 🚀 Quick Start

### Step 1: Set Up Supabase Database (10 minutes)

1. **Create a Supabase Project:**
   - Go to [Supabase](https://supabase.com)
   - Create a new account or sign in
   - Click "New Project"
   - Name it "Wedding RSVP"
   - Choose a strong database password
   - Select a region close to your guests

2. **Run the Database Schema:**
   - Go to the SQL Editor in your Supabase dashboard
   - Run this schema to create your tables:

   ```sql
   -- RSVP Responses Table
   CREATE TABLE rsvp_responses (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     guest_token VARCHAR(255) UNIQUE NOT NULL,
     guest_name VARCHAR(255) NOT NULL,
     attending BOOLEAN NOT NULL,
     meal_choice VARCHAR(255),
     dietary_restrictions TEXT,
     plus_one_name VARCHAR(255),
     plus_one_meal VARCHAR(255),
     plus_one_dietary TEXT,
     email_address VARCHAR(255),
     special_requests TEXT,
     email_confirmation_sent BOOLEAN DEFAULT FALSE,
     whatsapp_confirmation_sent BOOLEAN DEFAULT FALSE,
     submission_id VARCHAR(255) UNIQUE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Individual Guests Table (for WhatsApp campaigns)
   CREATE TABLE individual_guests (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     first_name VARCHAR(255) NOT NULL,
     last_name VARCHAR(255) NOT NULL,
     full_name VARCHAR(255) NOT NULL,
     email VARCHAR(255),
     phone VARCHAR(50),
     token VARCHAR(255) UNIQUE NOT NULL,
     has_used_token BOOLEAN DEFAULT FALSE,
     plus_one_eligible BOOLEAN DEFAULT FALSE,
     plus_one_name VARCHAR(255),
     plus_one_email VARCHAR(255),
     invitation_group VARCHAR(255),
     dietary_restrictions TEXT[],
     special_notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     last_accessed TIMESTAMP WITH TIME ZONE,
     whatsapp_link TEXT,
     invitation_sent BOOLEAN DEFAULT FALSE,
     reminder_count INTEGER DEFAULT 0,
     link_clicked BOOLEAN DEFAULT FALSE,
     click_count INTEGER DEFAULT 0,
     rsvp_completed BOOLEAN DEFAULT FALSE,
     rsvp_completed_at TIMESTAMP WITH TIME ZONE
   );

   -- Enable Row Level Security
   ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
   ALTER TABLE individual_guests ENABLE ROW LEVEL SECURITY;

   -- Create policies for public access (customize as needed)
   CREATE POLICY "Enable read access for all users" ON rsvp_responses FOR SELECT USING (true);
   CREATE POLICY "Enable insert for all users" ON rsvp_responses FOR INSERT WITH CHECK (true);
   CREATE POLICY "Enable update for all users" ON rsvp_responses FOR UPDATE USING (true);

   CREATE POLICY "Enable read access for all users" ON individual_guests FOR SELECT USING (true);
   CREATE POLICY "Enable insert for all users" ON individual_guests FOR INSERT WITH CHECK (true);
   CREATE POLICY "Enable update for all users" ON individual_guests FOR UPDATE USING (true);
   ```

3. **Get Your Supabase Credentials:**
   - Go to Settings → API in your Supabase dashboard
   - Copy the Project URL
   - Copy the anon public key
   - (Optional) Copy the service_role key for admin operations

### Step 2: Set Up EmailJS (5 minutes)

1. **Create EmailJS Account:**
   - Go to [EmailJS](https://www.emailjs.com/)
   - Sign up for free
   - Create a new service (Gmail, Outlook, etc.)

2. **Create Email Template:**
   - Create a template with variables like {{guest_name}}, {{wedding_date}}, etc.
   - Note down your Service ID and Template ID

### Step 3: Configure Environment Variables

1. **Update your `.env` file:**
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
   VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # EmailJS Configuration
   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

   # Application Settings
   REACT_APP_WEDDING_HASHTAG=#YourWeddingHashtag
   REACT_APP_WEBSITE_URL=https://yourweddingsite.com

   # WhatsApp Campaign Settings
   VITE_BASE_URL=https://yourweddingsite.com
   BACKUP_ENCRYPTION_KEY=your_secure_backup_key_here
   ```

2. **Deploy to Production:**
   - Add the same variables to your hosting platform (Vercel, Netlify, etc.)

## 🎯 How It Works

### For Your Guests:
1. **Secure Access:** Each guest gets a unique token/link
2. **Easy RSVP:** Simple form with meal choices and dietary restrictions
3. **Email Confirmations:** Automatic confirmation emails
4. **WhatsApp Integration:** Optional WhatsApp confirmations and invites

### For You (The Couple):
1. **Real-time Data:** All RSVPs save to your Supabase database automatically
2. **Admin Dashboard:** View and manage all responses
3. **WhatsApp Campaigns:** Send bulk invitations via WhatsApp
4. **Analytics:** Track response rates and engagement
5. **Export Data:** Download guest lists and responses

## 🎊 Features

### ✅ What's Included:
- ✅ Secure token-based RSVP system
- ✅ Beautiful, mobile-friendly forms
- ✅ Email confirmations
- ✅ WhatsApp integration and campaigns
- ✅ Meal choice selection
- ✅ Dietary restrictions tracking
- ✅ Plus-one management
- ✅ Real-time response dashboard
- ✅ Guest list management
- ✅ Analytics and reporting
- ✅ Secure database storage (Supabase)
- ✅ Backup and recovery systems

### 🔐 Security Features:
- Token-based guest authentication
- Rate limiting and fraud protection
- IP blocking for suspicious activity
- Encrypted backups
- Row-level security in Supabase

## 🛠 Testing Your Setup

1. **Test RSVP Flow:**
   - Create a test guest token
   - Visit `/rsvp?token=your_test_token`
   - Submit an RSVP
   - Check your Supabase database for the data

2. **Test Email Confirmations:**
   - Enable email confirmations in the form
   - Submit test RSVP
   - Check that confirmation email is sent

3. **Test WhatsApp Features:**
   - Import guest list via admin panel
   - Generate WhatsApp links
   - Test message templates

## ❓ Troubleshooting

### Common Issues:
- **RSVPs not saving:** Check your Supabase URL and API key
- **Emails not sending:** Verify EmailJS service configuration
- **Token not working:** Ensure the token exists in your guests table
- **WhatsApp links not generating:** Check phone number format and templates

### Getting Help:
- Check Supabase logs for database errors
- Verify all environment variables are set correctly
- Test API connections in your browser's developer console

## 🎉 Ready to Launch!

Your wedding RSVP system is now ready! Here's what to do next:

1. **Import Your Guest List:** Use the admin panel to bulk import guests
2. **Generate WhatsApp Links:** Create personalized invitation links
3. **Test Everything:** Do a complete test run with family/friends
4. **Send Invitations:** Launch your WhatsApp campaign
5. **Monitor Responses:** Track RSVPs in real-time
6. **Download Data:** Export final guest list for your venue

---

## 🆘 Need Help?

If you need assistance setting up your wedding RSVP system:
- Check the Supabase documentation
- Review the EmailJS setup guide
- Test each component individually
- Monitor your browser's console for errors

**Happy Wedding Planning! 💕**