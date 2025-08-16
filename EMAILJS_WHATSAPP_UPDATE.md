# EmailJS Template Update for WhatsApp Cards

## Overview
When a guest doesn't provide their email address, the bride and groom receive an email notification. We've now added a WhatsApp-friendly confirmation card to these emails that they can easily share with the guest via WhatsApp.

## How to Update Your EmailJS Template

### Step 1: Login to EmailJS
1. Go to https://dashboard.emailjs.com
2. Login with Dale & Kirsten's account

### Step 2: Edit the Template
1. Navigate to "Email Templates"
2. Find and click on your template (ID: `template_81ogd6i`)
3. Click "Edit" to modify the template

### Step 3: Add WhatsApp Card Section

Add this section to your email template where you want the WhatsApp card to appear (recommend after the main RSVP details):

```html
{{#if show_whatsapp_card}}
<div style="margin-top: 30px; padding: 20px; background: #FFF8E6; border-radius: 10px; border: 2px solid #C9A96E;">
  <h3 style="color: #8B7355; margin-top: 0;">Guest Email Not Provided</h3>
  <p style="color: #666;">{{guest_name}} didn't provide an email address. Below is a WhatsApp-friendly confirmation card you can share with them:</p>
  
  {{{whatsapp_card}}}
  
  <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 8px;">
    <h4 style="color: #8B7355; margin-top: 0;">How to share with {{guest_name}}:</h4>
    <ol style="color: #666;">
      <li>Take a screenshot of the confirmation card above</li>
      <li>Open WhatsApp and find {{guest_name}}'s chat</li>
      <li>Send them the screenshot with a personal message</li>
      <li>Or copy the text details and send as a message</li>
    </ol>
  </div>
</div>
{{/if}}
```

### Step 4: Update Subject Line (Optional)

For emails sent to the bride/groom when guest doesn't provide email, you might want to update the subject to:

```
RSVP: {{guest_name}} - {{attending}} (No Email Provided)
```

### Step 5: Save and Test

1. Click "Save" to save your template changes
2. Test by submitting an RSVP without providing an email address
3. Check that kirstendale583@gmail.com receives the email with the WhatsApp card

## New Template Variables

The system now sends these additional variables to EmailJS:

- `whatsapp_card`: HTML content of the WhatsApp-friendly confirmation card
- `show_whatsapp_card`: "yes" when guest didn't provide email, "no" otherwise
- `guest_provided_email`: "No" when email wasn't provided, "Yes" otherwise

## Testing Instructions

1. Go to your wedding website
2. Use any guest's token to access the RSVP form
3. Fill out the RSVP but DON'T check "Send email confirmation"
4. Submit the form
5. Check kirstendale583@gmail.com inbox
6. Verify the email contains the WhatsApp card section

## What the WhatsApp Card Looks Like

The card includes:
- Wedding header (Kirsten & Dale's Wedding)
- Date and venue
- Guest name
- Attendance status (ATTENDING/NOT ATTENDING) with color coding
- Meal selection (if attending)
- Dietary restrictions (if provided)
- Special requests (if provided)
- Instructions for sharing

The card is designed to be:
- Mobile-friendly
- Easy to screenshot
- Clear and professional
- Branded with your wedding colors

## Support

If you need help updating the template:
1. Check EmailJS documentation: https://www.emailjs.com/docs/
2. Contact EmailJS support if needed
3. The template should work with the triple curly braces `{{{whatsapp_card}}}` to render HTML content

## Important Notes

- The WhatsApp card ONLY appears when a guest doesn't provide their email
- Regular confirmation emails (when guest provides email) remain unchanged
- The bride/groom always receive notifications at kirstendale583@gmail.com for guests without emails
- The system automatically generates the WhatsApp card content - no manual work needed