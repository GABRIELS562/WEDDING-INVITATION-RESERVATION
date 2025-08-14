# EmailJS Setup Guide for Wedding RSVP

## Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up with your email (kirstendale583@gmail.com)
3. Verify your email address

## Step 2: Connect Gmail Service
1. In EmailJS dashboard, click "Email Services"
2. Click "Add New Service" 
3. Select "Gmail"
4. Follow the OAuth process to connect your Gmail
5. Note the **Service ID** (usually looks like `gmail_service_123`)

## Step 3: Create Email Template
1. Click "Email Templates"
2. Click "Create New Template"
3. Use this template name: `wedding_rsvp_confirmation`

### Template Content:
**Subject:** `RSVP Confirmation - {{bride_name}} & {{groom_name}} Wedding`

**HTML Body:**
```html
<div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #FEFCF9; padding: 40px; border-radius: 12px; border: 2px solid #C9A96E;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #C9A96E; padding-bottom: 20px;">
    <h1 style="color: #8B4513; font-size: 2.5em; margin-bottom: 10px; font-style: italic;">{{bride_name}} & {{groom_name}}</h1>
    <p style="color: #C9A96E; font-size: 1.2em; margin: 0;">October 31st, 2025</p>
    <p style="color: #8B7355; margin: 5px 0;">Cape Point Vineyards</p>
  </div>

  <!-- Main Content -->
  <div style="margin: 30px 0;">
    <h2 style="color: #8B4513; font-size: 1.8em;">Dear {{guest_name}},</h2>
    
    <p style="font-size: 1.1em; color: #8B7355; line-height: 1.6;">
      Thank you for your RSVP! We're {{#attending}}thrilled{{/attending}}{{^attending}}sorry{{/attending}} 
      {{#attending}}you'll be celebrating with us{{/attending}}{{^attending}}you can't make it{{/attending}}.
    </p>

    {{#attending}}
    <!-- Attending Details -->
    <div style="background-color: rgba(201, 169, 110, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C9A96E;">
      <h3 style="color: #8B4513; margin-top: 0;">Your RSVP Details:</h3>
      <ul style="color: #8B7355; font-size: 1em;">
        <li><strong>Attending:</strong> YES! 🎉</li>
        <li><strong>Meal Choice:</strong> {{meal_choice}}</li>
        {{#dietary_restrictions}}<li><strong>Dietary Restrictions:</strong> {{dietary_restrictions}}</li>{{/dietary_restrictions}}
        {{#special_requests}}<li><strong>Special Requests:</strong> {{special_requests}}</li>{{/special_requests}}
      </ul>
    </div>

    <!-- Wedding Details -->
    <div style="background-color: #F8F6F0; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #8B4513; margin-top: 0;">Wedding Details:</h3>
      <p style="color: #8B7355; margin: 5px 0;"><strong>📅 Date:</strong> Friday, October 31st, 2025</p>
      <p style="color: #8B7355; margin: 5px 0;"><strong>⏰ Ceremony:</strong> 4:00 PM</p>
      <p style="color: #8B7355; margin: 5px 0;"><strong>🍾 Reception:</strong> 6:00 PM</p>
      <p style="color: #8B7355; margin: 5px 0;"><strong>📍 Venue:</strong> Cape Point Vineyards</p>
      <p style="color: #8B7355; margin: 5px 0; font-style: italic;">Silvermine Road, Noordhoek, Cape Town</p>
    </div>
    {{/attending}}

    {{^attending}}
    <!-- Not Attending -->
    <div style="background-color: rgba(248, 246, 240, 0.8); padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #8B7355; font-size: 1.1em;">We understand you can't make it to our special day. Thank you for letting us know, and we'll miss having you there!</p>
    </div>
    {{/attending}}

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5D5B7;">
      <p style="color: #C9A96E; font-size: 1.2em; font-style: italic; margin-bottom: 10px;">
        We can't wait to celebrate with you! 💕
      </p>
      <p style="color: #8B7355; font-size: 0.9em;">
        Questions? Contact us at kirstendale583@gmail.com
      </p>
    </div>
  </div>
</div>
```

## Step 4: Get Your Keys
1. Go to "Account" tab in EmailJS
2. Copy your **Public Key** (looks like `user_abc123def`)
3. Note your **Service ID** from step 2
4. Note your **Template ID** from step 3

## Step 5: Update Environment Variables
Update your `.env` file with the real values:
```
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key_here
VITE_EMAILJS_SERVICE_ID=your_actual_service_id_here
VITE_EMAILJS_TEMPLATE_ID=wedding_rsvp_confirmation
```

## Step 6: Test Email
The website will automatically test the connection when someone submits an RSVP.