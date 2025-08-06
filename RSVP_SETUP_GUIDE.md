# 🎉 Wedding RSVP System - Complete Setup Guide

Your wedding website now has a **fully functional RSVP system**! Here's how to set it up and use it.

## 🚀 Quick Start

### Step 1: Set Up Google Sheets (5 minutes)

1. **Create a Google Spreadsheet:**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet
   - Name it "Wedding RSVP Responses"
   - Rename the first sheet to "RSVP_Individual"

2. **Add Column Headers** (copy this exactly to Row 1):
   ```
   A1: Timestamp
   B1: Guest Token  
   C1: Guest Name
   D1: Attending
   E1: Meal Choice
   F1: Dietary Restrictions
   G1: Plus One Name
   H1: Plus One Meal
   I1: Plus One Dietary
   J1: Email Address
   K1: Email Confirmation Sent
   L1: Submission ID
   ```

3. **Get Your Spreadsheet ID:**
   - Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit`

4. **Enable Google Sheets API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable "Google Sheets API"
   - Create credentials (API Key)
   - ⚠️ **Important:** Restrict the API key to your domain for security

### Step 2: Set Up EmailJS (5 minutes)

1. **Create Account:**
   - Go to [EmailJS.com](https://www.emailjs.com)
   - Sign up for free account

2. **Connect Email Service:**
   - Connect your Gmail/Outlook account
   - Note the **Service ID** (e.g., `service_abc123`)

3. **Create Email Template:**
   - Create a new template for RSVP confirmations
   - Use these variables in your template:
     ```
     {{to_name}} - Guest name
     {{attendance_status}} - "attending" or "not attending"
     {{meal_choice}} - Selected meal
     {{ceremony_venue}} - Venue name
     {{wedding_date}} - Wedding date
     ```
   - Note the **Template ID** (e.g., `template_xyz789`)

4. **Get Public Key:**
   - Go to Account Settings
   - Copy your **Public Key** (e.g., `user_abcdef123456`)

### Step 3: Update Environment Variables

Update your `.env` file with the actual values:

```env
# Google Sheets Configuration
REACT_APP_GOOGLE_SHEETS_API_KEY=your_actual_google_api_key
REACT_APP_GOOGLE_SPREADSHEET_ID=your_actual_spreadsheet_id

# EmailJS Configuration  
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
REACT_APP_EMAILJS_PUBLIC_KEY=user_abcdef123456

# Your Website URL (update when deployed)
REACT_APP_WEBSITE_URL=https://yourweddingwebsite.com
```

### Step 4: Generate Guest Invitations

1. **Go to Admin Panel:**
   - Visit `http://localhost:3000/admin` (or your deployed URL + `/admin`)

2. **Add Your Guests:**
   - Enter guest names and phone numbers
   - Mark if they can bring a plus-one

3. **Generate Invitations:**
   - Click "Generate Invitations"
   - Download the CSV file with all guest tokens and links

4. **Send WhatsApp Invitations:**
   - Click the WhatsApp buttons to send personalized invitations
   - Or copy the RSVP links and send them manually

## 🎯 How It Works

### For You (The Couple):
1. **Guest Management:** Use `/admin` to generate unique RSVP links
2. **WhatsApp Integration:** Send personalized invitations with one click
3. **Real-time Data:** All RSVPs save to your Google Sheets automatically
4. **Email Confirmations:** Guests get automatic email confirmations

### For Your Guests:
1. **Unique Links:** Each guest gets a personalized RSVP link
2. **Meal Selection:** Choose from your wedding menu options
3. **Plus-One Support:** Add plus-one details if applicable
4. **Email Confirmation:** Optional email confirmation of their RSVP

## 📱 Guest Experience

When guests click their WhatsApp link, they'll receive:

```
Hi John! 💕

Kirsten & Dale are getting married! 

You're invited to celebrate with us on October 31st, 2025 
at Cape Point Vineyards in Cape Town.

Please RSVP and choose your meal using this personalized link:
https://yourweddingwebsite.com/guest/JOHN1234AB

We can't wait to celebrate with you! 🥂✨

#KirstenDaleWedding
```

## 🔧 Testing Your Setup

1. **Test the Form:**
   - Go to `/admin` and create a test guest
   - Visit the generated RSVP link
   - Submit a test RSVP
   - Check your Google Sheets for the data

2. **Test Email:**
   - Make sure email confirmations are working
   - Check your spam folder if not receiving emails

## 📊 Viewing RSVP Data

All RSVP responses are saved to your Google Sheets with:
- Guest information and contact details
- Attendance status (Yes/No)
- Meal choices for guest and plus-one
- Dietary restrictions and special requests
- Email confirmation status
- Submission timestamps

## 🚀 Deployment

When you deploy your website:

1. **Update Environment Variables:**
   - Set `REACT_APP_WEBSITE_URL` to your actual domain
   - Update all environment variables in your hosting platform

2. **Test Production:**
   - Generate new guest invitations with the production URL
   - Test the complete RSVP workflow

## 🔒 Security Features

Your RSVP system includes:
- ✅ Unique guest tokens (prevents unauthorized access)
- ✅ Rate limiting (prevents spam submissions)
- ✅ Input sanitization (prevents malicious input)
- ✅ Token validation (ensures valid guest access)
- ✅ API key restrictions (secure Google Sheets access)

## 🆘 Troubleshooting

### Common Issues:

**"RSVP submission failed"**
- Check your Google Sheets API key
- Verify the spreadsheet ID is correct
- Ensure the sheet is named "RSVP_Individual"

**"Email failed to send"**
- Check EmailJS service ID, template ID, and public key
- Verify your email service is connected
- Check EmailJS dashboard for error logs

**"Invalid guest token"**
- Make sure guests use the exact link provided
- Check if the token was generated correctly

## 🎉 You're Ready!

Your wedding RSVP system is now complete! You can:

✅ Generate unique guest invitations  
✅ Send WhatsApp invitations automatically  
✅ Collect RSVPs and meal selections  
✅ Store all data in Google Sheets  
✅ Send email confirmations  
✅ Track responses in real-time  

**Next Steps:**
1. Set up your Google Sheets and EmailJS accounts
2. Update your environment variables
3. Test with a few friends/family first
4. Deploy and send out your invitations!

---

*Need help? Check the console for any error messages or create an issue in your project repository.*