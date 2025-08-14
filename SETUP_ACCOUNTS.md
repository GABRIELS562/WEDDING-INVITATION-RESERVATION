# 🎯 COMPLETE SETUP GUIDE - Supabase & EmailJS

## Part 1: Supabase Setup (Database)

### Step 1: Create Account
1. Go to **[https://supabase.com](https://supabase.com)**
2. Click **"Start your project"** → **"Sign up"**
3. Use **GitHub** (easiest) or email to sign up

### Step 2: Create Project
1. Click **"New project"**
2. Project settings:
   - **Name**: `dale-kirsten-wedding`
   - **Database Password**: Create strong password & **SAVE IT!**
   - **Region**: Choose closest to you
3. Click **"Create new project"**
4. **Wait 2-3 minutes** for setup

### Step 3: Run Database Setup
1. Click **"SQL Editor"** in left sidebar
2. Click **"New query"**
3. **Copy the ENTIRE contents** of the file `supabase-schema.sql` from your project
4. **Paste it** into the SQL editor
5. Click **"Run"** button
6. You should see success messages

### Step 4: Get Your Credentials
1. Go to **"Settings"** → **"API"** 
2. **COPY THESE VALUES:**
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API Key**: `eyJhbGciOiJIUzI1NiIsInR...` (the anon/public key)

### Step 5: Add Test Guest Data
1. Go to **"Table Editor"** → **"guests"** table
2. Click **"Insert"** → **"Insert row"**
3. Add this test data:
   - **guest_name**: `Jamie Test`
   - **unique_token**: `jamie-test-abc12345`
   - **whatsapp_number**: `+1234567890` (optional)
4. Click **"Save"**

---

## Part 2: EmailJS Setup (Email Service)

### Step 1: Create Account
1. Go to **[https://emailjs.com](https://emailjs.com)**
2. Click **"Sign Up"**
3. Create account with email (free plan is fine)
4. Verify your email

### Step 2: Add Email Service
1. Go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"** (recommended)
4. **Service ID**: Use `gmail_service` 
5. Connect your Gmail account
6. Click **"Create Service"**

### Step 3: Create Email Template
1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. **Template ID**: Use `wedding_rsvp_confirmation`
4. **Subject**: `RSVP Confirmation - Dale & Kirsten's Wedding`
5. **Content**: Replace the template content with this HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>RSVP Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #d4af37; font-size: 32px;">Dale & Kirsten</h1>
        <h2 style="color: #666; font-size: 24px;">Wedding RSVP Confirmation</h2>
        <div style="width: 100px; height: 2px; background: #d4af37; margin: 20px auto;"></div>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #333; margin-top: 0;">Dear {{guest_name}},</h3>
        
        {{#attending}}
        <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; font-size: 18px;">✓ Thank you for confirming your attendance!</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6;">We're absolutely thrilled that you'll be celebrating with us on our special day. Your presence will make our wedding complete!</p>
        
        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #d4af37;">
            <h4 style="color: #d4af37; margin-top: 0;">Your RSVP Details:</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #333;">Name:</td>
                    <td style="padding: 8px 0; color: #666;">{{guest_name}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #333;">Attending:</td>
                    <td style="padding: 8px 0; color: #28a745; font-weight: bold;">Yes ✓</td>
                </tr>
                {{#meal_choice}}
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #333;">Meal Choice:</td>
                    <td style="padding: 8px 0; color: #666;">{{meal_choice}}</td>
                </tr>
                {{/meal_choice}}
                {{#dietary_restrictions}}
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #333;">Dietary Restrictions:</td>
                    <td style="padding: 8px 0; color: #666;">{{dietary_restrictions}}</td>
                </tr>
                {{/dietary_restrictions}}
            </table>
        </div>
        {{/attending}}
        
        {{^attending}}
        <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">We're sorry you won't be able to join us, but we completely understand.</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6;">You'll be missed on our special day, but we hope to celebrate with you soon!</p>
        {{/attending}}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-style: italic; color: #666;">With love and excitement,</p>
            <p style="margin: 10px 0 0 0; font-size: 18px; color: #d4af37; font-weight: bold;">Dale & Kirsten ❤️</p>
        </div>
    </div>
    
    <div style="text-align: center; color: #999; font-size: 14px; line-height: 1.6;">
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h4 style="color: #666; margin-top: 0;">Wedding Details</h4>
            <p style="margin: 5px 0;"><strong>Date:</strong> June 15, 2024</p>
            <p style="margin: 5px 0;"><strong>Venue:</strong> Cape Point Vista</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> 4:00 PM</p>
        </div>
        <p style="margin-top: 20px;">Need to make changes to your RSVP? <br>Contact us at <a href="mailto:hello@daleandkirsten.com" style="color: #d4af37;">hello@daleandkirsten.com</a></p>
    </div>
</body>
</html>
```

6. Click **"Save"**

### Step 4: Get Your API Keys
1. Go to **"Account"** in the sidebar
2. Look for **"API Keys"** section
3. **COPY YOUR PUBLIC KEY** (starts with something like `user_...`)

---

## Part 3: Update Your .env File

Now update your `.env` file with the real credentials:

1. Open `.env` file in your project
2. Replace these values:

```bash
# SUPABASE - Replace with values from Supabase Step 4
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR...

# EMAILJS - Replace with values from EmailJS Step 4
VITE_EMAILJS_PUBLIC_KEY=user_your_public_key_here
VITE_EMAILJS_SERVICE_ID=gmail_service
VITE_EMAILJS_TEMPLATE_ID=wedding_rsvp_confirmation
```

## Part 4: Test Everything!

1. **Restart your dev server**: 
   - Press `Ctrl+C` in terminal
   - Run `npm run dev` again

2. **Test with valid token**: 
   - Go to: http://localhost:3000/rsvp?token=jamie-test-abc12345
   - Fill out and submit RSVP form
   - Should work and send email!

3. **Test invalid token**:
   - Go to: http://localhost:3000/rsvp?token=invalid-token
   - Should show error message

## 🎉 You're Done!

Your wedding website should now be fully functional with:
- ✅ Database connectivity
- ✅ RSVP submissions  
- ✅ Email confirmations
- ✅ Secure guest authentication

Need help? Check the browser console (F12) for any error messages!