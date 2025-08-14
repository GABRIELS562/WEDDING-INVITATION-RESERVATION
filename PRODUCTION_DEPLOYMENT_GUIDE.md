# Production Deployment Guide

## Current Status ✅
- ✅ React + Vite website working locally
- ✅ Supabase database connected and working
- ✅ RSVP form functional
- 🚧 EmailJS needs setup (15 minutes)

## Pre-Deployment Checklist

### 1. Environment Variables for Vercel
Create these environment variables in Vercel dashboard:

```
VITE_SUPABASE_URL=https://wldydpwjsmsqtehdwxvq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZHlkcHdqc21zcXRlaGR3eHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjAyMDEsImV4cCI6MjA3MDczNjIwMX0.RMFQ7sqEOJEtMjLcYY8c9_5A95kKY63zeIyZWkWdTSU

# After EmailJS setup, add:
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id  
VITE_EMAILJS_TEMPLATE_ID=wedding_rsvp_confirmation

# Wedding details:
VITE_BRIDE_NAME=Kirsten
VITE_GROOM_NAME=Dale
VITE_WEDDING_DATE=2025-10-31
VITE_WEDDING_VENUE=Cape Point Vineyards
VITE_BASE_URL=https://your-vercel-domain.vercel.app
```

### 2. Build Test
Test the build locally before deploying:

```bash
npm run build
npm run preview
```

### 3. Vercel Deployment Commands
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

## Testing Checklist

### Before Deployment:
- [ ] Website loads at localhost:3000
- [ ] RSVP form accepts submissions
- [ ] Supabase saves data correctly
- [ ] EmailJS sends confirmation emails

### After Deployment:  
- [ ] Production site loads correctly
- [ ] Guest token URLs work: `/guest/test-token`
- [ ] RSVP submissions work end-to-end
- [ ] Email confirmations send
- [ ] Mobile responsiveness
- [ ] All images load properly

## What Works Right Now (Without EmailJS)
1. ✅ Beautiful wedding website
2. ✅ Guest can fill out RSVP form
3. ✅ Data saves to Supabase database
4. ✅ Form validation and error handling
5. ❌ Email confirmations (needs EmailJS setup)

## Ready to Deploy?
**Almost!** You can deploy now and everything will work except email confirmations. The RSVP data will save correctly to your database.

To get email working:
1. Follow EMAILJS_SETUP_GUIDE.md (15 minutes)
2. Add the EmailJS environment variables to Vercel
3. Redeploy

The website is **production-ready** for RSVP collection!