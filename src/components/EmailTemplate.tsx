/**
 * Wedding RSVP Email Template Components
 * Dale & Kirsten's Wedding - October 31st, 2025
 * 
 * Beautiful, mobile-responsive HTML email templates
 * with wedding theme for EmailJS integration
 */

import React from 'react';

// Email template data interface
interface EmailTemplateData {
  guest_name: string;
  guest_email: string;
  attending_status: string;
  meal_choice?: string;
  dietary_restrictions?: string;
  wedding_date: string;
  wedding_time: string;
  venue_name: string;
  venue_address: string;
  couple_names: string;
  rsvp_deadline: string;
  contact_email: string;
  website_url: string;
  submission_id: string;
  formatted_date: string;
  confirmation_message: string;
}

/**
 * Generate HTML email template for RSVP confirmation
 */
export function generateRSVPConfirmationHTML(data: EmailTemplateData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RSVP Confirmation - ${data.couple_names} Wedding</title>
    <style>
        /* Reset styles */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        /* Base styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #4a5568;
            background-color: #f8f6f0;
            margin: 0;
            padding: 20px;
        }
        
        /* Container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(139, 115, 85, 0.15);
            border: 1px solid rgba(201, 169, 110, 0.2);
        }
        
        /* Header */
        .email-header {
            background: linear-gradient(135deg, #f4f1e8 0%, #f8f6f0 100%);
            padding: 40px 30px;
            text-align: center;
            border-bottom: 3px solid #c9a96e;
        }
        
        .header-title {
            font-size: 32px;
            font-weight: 300;
            color: #8b4513;
            margin-bottom: 8px;
            font-family: Georgia, 'Times New Roman', serif;
            font-style: italic;
        }
        
        .header-subtitle {
            font-size: 16px;
            color: #8b7355;
            margin-bottom: 20px;
            font-weight: 500;
        }
        
        .header-icon {
            font-size: 24px;
            margin: 0 8px;
        }
        
        /* Content */
        .email-content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #8b4513;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .confirmation-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
        }
        
        .confirmation-icon {
            font-size: 48px;
            margin-bottom: 15px;
            display: block;
        }
        
        .confirmation-title {
            font-size: 20px;
            font-weight: 600;
            color: #065f46;
            margin-bottom: 10px;
        }
        
        .confirmation-message {
            font-size: 16px;
            color: #047857;
            line-height: 1.6;
        }
        
        /* RSVP Details */
        .rsvp-details {
            background-color: #fefcf9;
            border: 1px solid #e5d5b7;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .details-title {
            font-size: 18px;
            font-weight: 600;
            color: #8b4513;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .details-grid {
            display: table;
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 10px;
        }
        
        .detail-row {
            display: table-row;
        }
        
        .detail-label {
            display: table-cell;
            font-weight: 600;
            color: #8b7355;
            padding-right: 20px;
            vertical-align: top;
            width: 40%;
        }
        
        .detail-value {
            display: table-cell;
            color: #4a5568;
            vertical-align: top;
        }
        
        /* Wedding Details */
        .wedding-details {
            background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
            border: 1px solid #f3d1d8;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
        }
        
        .wedding-title {
            font-size: 18px;
            font-weight: 600;
            color: #8b4513;
            margin-bottom: 20px;
        }
        
        .wedding-date {
            font-size: 24px;
            font-weight: 700;
            color: #be185d;
            margin-bottom: 10px;
            font-family: Georgia, 'Times New Roman', serif;
        }
        
        .wedding-time {
            font-size: 18px;
            color: #8b7355;
            margin-bottom: 15px;
        }
        
        .venue-name {
            font-size: 20px;
            font-weight: 600;
            color: #8b4513;
            margin-bottom: 8px;
        }
        
        .venue-address {
            font-size: 14px;
            color: #8b7355;
            line-height: 1.5;
        }
        
        /* Important Info */
        .important-info {
            background-color: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
        }
        
        .important-title {
            font-size: 16px;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 10px;
        }
        
        .important-text {
            font-size: 14px;
            color: #a16207;
            line-height: 1.5;
        }
        
        /* Contact Section */
        .contact-section {
            background-color: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
        }
        
        .contact-title {
            font-size: 18px;
            font-weight: 600;
            color: #8b4513;
            margin-bottom: 15px;
        }
        
        .contact-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 15px;
        }
        
        .contact-email {
            color: #c9a96e;
            text-decoration: none;
            font-weight: 500;
        }
        
        .contact-email:hover {
            color: #b8956a;
        }
        
        /* Footer */
        .email-footer {
            background: linear-gradient(135deg, #8b7355 0%, #6b5b47 100%);
            color: #f8f6f0;
            padding: 30px;
            text-align: center;
        }
        
        .footer-couple {
            font-size: 24px;
            font-weight: 300;
            margin-bottom: 10px;
            font-family: Georgia, 'Times New Roman', serif;
            font-style: italic;
        }
        
        .footer-text {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 20px;
        }
        
        .footer-links {
            margin-bottom: 20px;
        }
        
        .footer-link {
            color: #c9a96e;
            text-decoration: none;
            margin: 0 15px;
            font-size: 14px;
        }
        
        .footer-link:hover {
            color: #ffffff;
        }
        
        .footer-copyright {
            font-size: 12px;
            opacity: 0.7;
            border-top: 1px solid rgba(201, 169, 110, 0.3);
            padding-top: 15px;
            margin-top: 15px;
        }
        
        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
            body { padding: 10px; }
            .email-container { border-radius: 12px; }
            .email-header { padding: 30px 20px; }
            .email-content { padding: 30px 20px; }
            .header-title { font-size: 28px; }
            .greeting { font-size: 20px; }
            .wedding-date { font-size: 20px; }
            .venue-name { font-size: 18px; }
            .details-grid { display: block; }
            .detail-row { display: block; margin-bottom: 15px; }
            .detail-label { display: block; margin-bottom: 5px; }
            .detail-value { display: block; }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .email-container { background-color: #1f2937; }
            .email-content { color: #e5e7eb; }
            .rsvp-details { background-color: #374151; border-color: #4b5563; }
            .wedding-details { background: linear-gradient(135deg, #374151 0%, #4b5563 100%); }
            .contact-section { background-color: #374151; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1 class="header-title">${data.couple_names}</h1>
            <p class="header-subtitle">Wedding Celebration</p>
            <div>
                <span class="header-icon">💕</span>
                <span class="header-icon">💍</span>
                <span class="header-icon">💕</span>
            </div>
        </div>
        
        <!-- Content -->
        <div class="email-content">
            <h2 class="greeting">Hello ${data.guest_name}! 🎉</h2>
            
            <!-- Confirmation Box -->
            <div class="confirmation-box">
                <span class="confirmation-icon">${data.attending_status === 'attending' ? '✅' : '💌'}</span>
                <h3 class="confirmation-title">
                    ${data.attending_status === 'attending' ? 'RSVP Confirmed!' : 'Thank You for Responding'}
                </h3>
                <p class="confirmation-message">${data.confirmation_message}</p>
            </div>
            
            <!-- RSVP Details -->
            <div class="rsvp-details">
                <h3 class="details-title">Your RSVP Details</h3>
                <div class="details-grid">
                    <div class="detail-row">
                        <div class="detail-label">Guest Name:</div>
                        <div class="detail-value">${data.guest_name}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Attendance:</div>
                        <div class="detail-value">${data.attending_status === 'attending' ? '✅ Attending' : '❌ Unable to Attend'}</div>
                    </div>
                    ${data.attending_status === 'attending' && data.meal_choice ? `
                    <div class="detail-row">
                        <div class="detail-label">Meal Choice:</div>
                        <div class="detail-value">${data.meal_choice}</div>
                    </div>
                    ` : ''}
                    ${data.attending_status === 'attending' && data.dietary_restrictions ? `
                    <div class="detail-row">
                        <div class="detail-label">Dietary Requirements:</div>
                        <div class="detail-value">${data.dietary_restrictions}</div>
                    </div>
                    ` : ''}
                    <div class="detail-row">
                        <div class="detail-label">Confirmation ID:</div>
                        <div class="detail-value">${data.submission_id}</div>
                    </div>
                </div>
            </div>
            
            ${data.attending_status === 'attending' ? `
            <!-- Wedding Details -->
            <div class="wedding-details">
                <h3 class="wedding-title">Wedding Details</h3>
                <div class="wedding-date">${data.wedding_date}</div>
                <div class="wedding-time">${data.wedding_time}</div>
                <div class="venue-name">${data.venue_name}</div>
                <div class="venue-address">${data.venue_address}</div>
            </div>
            
            <!-- Important Information -->
            <div class="important-info">
                <h4 class="important-title">📋 Important Information</h4>
                <div class="important-text">
                    <strong>Dress Code:</strong> Cocktail Attire<br>
                    <strong>Arrival:</strong> Please arrive 15 minutes before the ceremony<br>
                    <strong>Parking:</strong> Complimentary valet parking available<br>
                    <strong>Photography:</strong> Unplugged ceremony - please enjoy the moment!
                </div>
            </div>
            ` : ''}
            
            <!-- Contact Section -->
            <div class="contact-section">
                <h3 class="contact-title">Need to Make Changes?</h3>
                <p class="contact-text">
                    If you need to update your RSVP or have any questions, please don't hesitate to reach out:
                </p>
                <p>
                    📧 <a href="mailto:${data.contact_email}?subject=RSVP Update - ${data.guest_name}" class="contact-email">${data.contact_email}</a>
                </p>
                <p class="contact-text">
                    💬 WhatsApp us for immediate assistance<br>
                    🌐 Visit <a href="${data.website_url}" class="contact-email">${data.website_url}</a>
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <h2 class="footer-couple">${data.couple_names}</h2>
            <p class="footer-text">Thank you for being part of our love story</p>
            
            <div class="footer-links">
                <a href="${data.website_url}" class="footer-link">Wedding Website</a>
                <a href="mailto:${data.contact_email}" class="footer-link">Contact Us</a>
            </div>
            
            <div class="footer-copyright">
                © ${new Date().getFullYear()} ${data.couple_names} Wedding • ${data.wedding_date}<br>
                ${data.venue_name}, Cape Town, South Africa
            </div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generate plain text version for email clients that don't support HTML
 */
export function generateRSVPConfirmationText(data: EmailTemplateData): string {
  return `
RSVP CONFIRMATION - ${data.couple_names.toUpperCase()} WEDDING

Hello ${data.guest_name}!

${data.confirmation_message}

YOUR RSVP DETAILS:
• Guest Name: ${data.guest_name}
• Attendance: ${data.attending_status === 'attending' ? 'Attending' : 'Unable to Attend'}
${data.attending_status === 'attending' && data.meal_choice ? `• Meal Choice: ${data.meal_choice}` : ''}
${data.attending_status === 'attending' && data.dietary_restrictions ? `• Dietary Requirements: ${data.dietary_restrictions}` : ''}
• Confirmation ID: ${data.submission_id}

${data.attending_status === 'attending' ? `
WEDDING DETAILS:
• Date: ${data.wedding_date}
• Time: ${data.wedding_time}
• Venue: ${data.venue_name}
• Address: ${data.venue_address}

IMPORTANT INFORMATION:
• Dress Code: Cocktail Attire
• Please arrive 15 minutes before the ceremony
• Complimentary valet parking available
• Unplugged ceremony - please enjoy the moment!
` : ''}

NEED TO MAKE CHANGES?
If you need to update your RSVP or have any questions:
• Email: ${data.contact_email}
• WhatsApp us for immediate assistance
• Visit: ${data.website_url}

---
${data.couple_names}
${data.wedding_date} • ${data.venue_name}, Cape Town
"Thank you for being part of our love story"
`;
}

/**
 * Generate EmailJS template variables mapping
 * This helps with setting up the EmailJS template
 */
export function getEmailJSTemplateVariables(): Record<string, string> {
  return {
    to_email: '{{to_email}}',
    to_name: '{{to_name}}',
    from_email: '{{from_email}}',
    from_name: '{{from_name}}',
    subject: '{{subject}}',
    guest_name: '{{guest_name}}',
    attending_status: '{{attending_status}}',
    meal_choice: '{{meal_choice}}',
    dietary_restrictions: '{{dietary_restrictions}}',
    wedding_date: '{{wedding_date}}',
    wedding_time: '{{wedding_time}}',
    venue_name: '{{venue_name}}',
    venue_address: '{{venue_address}}',
    couple_names: '{{couple_names}}',
    rsvp_deadline: '{{rsvp_deadline}}',
    contact_email: '{{contact_email}}',
    website_url: '{{website_url}}',
    submission_id: '{{submission_id}}',
    formatted_date: '{{formatted_date}}',
    confirmation_message: '{{confirmation_message}}',
    year: '{{year}}'
  };
}

/**
 * React component for email template preview (development use)
 */
export const EmailTemplatePreview: React.FC<{ data: EmailTemplateData }> = ({ data }) => {
  return (
    <div className="email-preview">
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Email Preview</h3>
        <p><strong>To:</strong> {data.guest_email}</p>
        <p><strong>Subject:</strong> RSVP Confirmation - {data.couple_names} Wedding</p>
      </div>
      
      <div 
        className="border rounded"
        dangerouslySetInnerHTML={{ 
          __html: generateRSVPConfirmationHTML(data) 
        }} 
      />
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h4 className="font-bold mb-2">Plain Text Version:</h4>
        <pre className="text-sm whitespace-pre-wrap">
          {generateRSVPConfirmationText(data)}
        </pre>
      </div>
    </div>
  );
};

export default {
  generateRSVPConfirmationHTML,
  generateRSVPConfirmationText,
  getEmailJSTemplateVariables,
  EmailTemplatePreview
};