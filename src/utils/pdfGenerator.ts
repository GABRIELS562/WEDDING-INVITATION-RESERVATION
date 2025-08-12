// PDF generation service for RSVP confirmations
import type { RSVPSubmission } from '../types';

export interface RSVPConfirmationData {
  guestName: string;
  attendance: 'yes' | 'no';
  mealChoice?: string;
  dietaryRestrictions?: string;
  specialRequests?: string;
  submittedAt: Date;
  whatsappNumber?: string;
}

/**
 * Generate HTML content styled like the wedding website
 */
export function generateConfirmationHTML(data: RSVPConfirmationData): string {
  const attendanceText = data.attendance === 'yes' ? 'ATTENDING' : 'NOT ATTENDING';
  const attendanceColor = data.attendance === 'yes' ? '#4CAF50' : '#F44336';
  const attendanceIcon = data.attendance === 'yes' ? '✅' : '❌';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>RSVP Confirmation - Kirsten & Dale Wedding</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #FBF8F1 0%, #F8F4E6 100%);
                min-height: 100vh;
                padding: 2rem;
                color: #8B7355;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(139, 115, 85, 0.15);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #C9A96E 0%, #D4B886 100%);
                color: white;
                padding: 3rem 2rem;
                text-align: center;
            }
            
            .couple-names {
                font-family: 'Playfair Display', serif;
                font-size: 2.5rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                letter-spacing: 2px;
            }
            
            .wedding-date {
                font-size: 1.1rem;
                font-weight: 300;
                letter-spacing: 1px;
                opacity: 0.9;
            }
            
            .venue {
                font-size: 1rem;
                margin-top: 0.5rem;
                opacity: 0.8;
            }
            
            .content {
                padding: 3rem 2rem;
            }
            
            .confirmation-badge {
                background: ${attendanceColor};
                color: white;
                padding: 1rem 2rem;
                border-radius: 50px;
                text-align: center;
                font-weight: 600;
                font-size: 1.2rem;
                margin-bottom: 2rem;
                letter-spacing: 1px;
            }
            
            .guest-name {
                font-family: 'Playfair Display', serif;
                font-size: 2rem;
                color: #8B7355;
                text-align: center;
                margin-bottom: 2rem;
                font-weight: 500;
            }
            
            .details-grid {
                display: grid;
                gap: 1.5rem;
                margin: 2rem 0;
            }
            
            .detail-item {
                padding: 1.5rem;
                background: rgba(201, 169, 110, 0.05);
                border-radius: 12px;
                border-left: 4px solid #C9A96E;
            }
            
            .detail-label {
                font-weight: 600;
                color: #8B7355;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 0.5rem;
            }
            
            .detail-value {
                color: #6B5B47;
                font-size: 1.1rem;
                line-height: 1.4;
            }
            
            .footer {
                text-align: center;
                padding: 2rem;
                background: rgba(201, 169, 110, 0.1);
                color: #8B7355;
                font-style: italic;
            }
            
            .heart {
                color: #C9A96E;
                font-size: 1.2rem;
                margin: 0 0.5rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="couple-names">Kirsten & Dale</div>
                <div class="wedding-date">October 31st, 2025 • 4:00 PM</div>
                <div class="venue">Cape Point Vineyards</div>
            </div>
            
            <div class="content">
                <div class="confirmation-badge">
                    ${attendanceIcon} ${attendanceText}
                </div>
                
                <div class="guest-name">${data.guestName}</div>
                
                <div class="details-grid">
                    <div class="detail-item">
                        <div class="detail-label">RSVP Status</div>
                        <div class="detail-value">${data.attendance === 'yes' ? 'We are delighted you will be joining us!' : 'We understand and appreciate you letting us know.'}</div>
                    </div>
                    
                    ${data.attendance === 'yes' && data.mealChoice ? `
                    <div class="detail-item">
                        <div class="detail-label">Menu Selection</div>
                        <div class="detail-value">${data.mealChoice}</div>
                    </div>
                    ` : ''}
                    
                    ${data.dietaryRestrictions ? `
                    <div class="detail-item">
                        <div class="detail-label">Dietary Requirements</div>
                        <div class="detail-value">${data.dietaryRestrictions}</div>
                    </div>
                    ` : ''}
                    
                    ${data.specialRequests ? `
                    <div class="detail-item">
                        <div class="detail-label">Special Message</div>
                        <div class="detail-value">${data.specialRequests}</div>
                    </div>
                    ` : ''}
                    
                    <div class="detail-item">
                        <div class="detail-label">Submitted</div>
                        <div class="detail-value">${data.submittedAt.toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</div>
                    </div>
                    
                    ${data.whatsappNumber ? `
                    <div class="detail-item">
                        <div class="detail-label">Contact Number</div>
                        <div class="detail-value">${data.whatsappNumber}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for being part of our special day!</p>
                <p><span class="heart">♥</span>With love, Kirsten & Dale<span class="heart">♥</span></p>
            </div>
        </div>
    </body>
    </html>
  `;
}

/**
 * Generate downloadable HTML file as Blob
 */
export function generateConfirmationFile(data: RSVPConfirmationData): Blob {
  const htmlContent = generateConfirmationHTML(data);
  return new Blob([htmlContent], { type: 'text/html' });
}

/**
 * Create download link for confirmation file
 */
export function createDownloadLink(data: RSVPConfirmationData): string {
  const blob = generateConfirmationFile(data);
  const url = URL.createObjectURL(blob);
  return url;
}

/**
 * Download confirmation file directly
 */
export function downloadConfirmation(data: RSVPConfirmationData): void {
  const blob = generateConfirmationFile(data);
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `RSVP-Confirmation-${data.guestName.replace(/\s+/g, '-')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Convert RSVP submission to confirmation data
 */
export function rsvpToConfirmationData(rsvp: RSVPSubmission): RSVPConfirmationData {
  return {
    guestName: rsvp.guestName,
    attendance: rsvp.isAttending ? 'yes' : 'no',
    mealChoice: rsvp.mealChoice,
    dietaryRestrictions: rsvp.dietaryRestrictions,
    specialRequests: rsvp.specialRequests,
    submittedAt: new Date(rsvp.submittedAt || Date.now()),
    whatsappNumber: rsvp.whatsappNumber
  };
}

export default {
  generateConfirmationHTML,
  generateConfirmationFile,
  createDownloadLink,
  downloadConfirmation,
  rsvpToConfirmationData
};