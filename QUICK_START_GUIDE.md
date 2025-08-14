# 🚀 Quick Start Guide - Dale & Kirsten's Wedding RSVP

## ✅ Your Website is Running!

Your development server is now running at: **http://localhost:3000**

## 🔐 Next Steps to Complete Setup

### 1. Update Your Environment File

Edit the `.env` file in your project root with your actual credentials:

```bash
# Replace these with your actual Supabase credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Replace these with your actual EmailJS credentials
VITE_EMAILJS_PUBLIC_KEY=your-emailjs-public-key-here
VITE_EMAILJS_SERVICE_ID=gmail_service
VITE_EMAILJS_TEMPLATE_ID=wedding_rsvp_confirmation
```

### 2. Add Sample Test Guests to Supabase

1. Go to your Supabase dashboard
2. Click **"Table Editor"** → **"guests"**
3. Click **"Insert"** → **"Insert row"**
4. Add these test guests:

**Test Guest 1:**
- `guest_name`: Jamie Test
- `whatsapp_number`: +27722108714
- `unique_token`: jamie-test-abc12345

**Test Guest 2:**
- `guest_name`: John Doe
- `whatsapp_number`: +1234567890
- `unique_token`: john-doe-xyz67890

**Test Guest 3:**
- `guest_name`: Jane Smith
- `whatsapp_number`: +1987654321
- `unique_token`: jane-smith-def54321

### 3. Test the RSVP Flow

Once you've added the credentials and test guests:

1. **Visit Homepage**: http://localhost:3000
2. **Test RSVP with valid token**: http://localhost:3000/rsvp?token=jamie-test-abc12345
3. **Test invalid token**: http://localhost:3000/rsvp?token=invalid-token

### 4. Test Different Pages

- **Homepage**: http://localhost:3000
- **RSVP Page**: http://localhost:3000/rsvp?token=jamie-test-abc12345
- **Admin Dashboard**: http://localhost:3000/admin (if admin features are enabled)

## 🎯 What Should Work

### ✅ Currently Working:
- ✅ Website loads and renders
- ✅ Navigation and UI components
- ✅ RSVP form interface
- ✅ Responsive design

### ⚠️ Needs Your Credentials:
- 🔄 Database connectivity (needs Supabase setup)
- 🔄 RSVP form submissions (needs Supabase setup)
- 🔄 Email confirmations (needs EmailJS setup)

## 🐛 Troubleshooting

### If the site won't load:
1. Check the terminal for errors
2. Ensure port 3000 isn't being used by another app
3. Try restarting: `Ctrl+C` then `npm run dev`

### If RSVP submissions fail:
1. Check your Supabase credentials in `.env`
2. Verify the database schema was created successfully
3. Check browser console for detailed errors

### If emails don't send:
1. Verify EmailJS credentials in `.env`
2. Check EmailJS template is properly configured
3. Ensure Gmail service is connected in EmailJS

## 📊 Test Data

Use these test tokens for development:
- `jamie-test-abc12345` - Jamie Test
- `john-doe-xyz67890` - John Doe  
- `jane-smith-def54321` - Jane Smith

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests (if available)
npm test

# Check TypeScript
npm run type-check

# Run linting
npm run lint
```

## 📝 Next Steps for Production

Once everything is working locally:
1. Follow the `PRODUCTION_DEPLOYMENT_CHECKLIST.md` for going live
2. Set up production Supabase database
3. Configure production EmailJS account
4. Deploy to Vercel

## 🎉 Enjoy Testing Your Wedding Website!

Your wedding RSVP system is ready for testing. Once you add your real credentials, it will be fully functional!