// WhatsApp confirmation service for sending notifications to wedding clients
export interface WhatsAppConfirmationData {
  guestName: string;
  email?: string;
  attendance: 'yes' | 'no';
  mealChoice?: string;
  dietaryRestrictions?: string;
  specialRequests?: string;
  submittedAt: Date;
  token: string;
}

// Your (wedding clients') WhatsApp numbers for receiving confirmations
const WEDDING_CLIENTS_WHATSAPP = [
  '+27722108714', // Your test number
  // Add Kirsten's and Dale's numbers here when ready
];

/**
 * Generate WhatsApp message for wedding clients when guest submits RSVP
 */
export function generateClientWhatsAppMessage(data: WhatsAppConfirmationData): string {
  const attendanceText = data.attendance === 'yes' ? '✅ ATTENDING' : '❌ NOT ATTENDING';
  
  let message = `🎉 NEW RSVP SUBMISSION\n\n`;
  message += `👤 Guest: ${data.guestName}\n`;
  message += `📧 Email: ${data.email || 'Not provided'}\n`;
  message += `📅 Attendance: ${attendanceText}\n`;
  
  if (data.attendance === 'yes' && data.mealChoice) {
    message += `🍽️ Meal: ${data.mealChoice}\n`;
    
    if (data.dietaryRestrictions) {
      message += `🚫 Dietary: ${data.dietaryRestrictions}\n`;
    }
  }
  
  if (data.specialRequests) {
    message += `💬 Message: ${data.specialRequests}\n`;
  }
  
  message += `⏰ Submitted: ${data.submittedAt.toLocaleString()}\n`;
  message += `🔗 Token: ${data.token.substring(0, 8)}...\n\n`;
  
  message += `💕 Kirsten & Dale Wedding RSVP System`;
  
  return message;
}

/**
 * Generate WhatsApp link with pre-filled message
 */
export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  // Remove non-numeric characters and ensure it starts with +
  const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanNumber.replace('+', '')}?text=${encodedMessage}`;
}

/**
 * Get WhatsApp links for all wedding clients
 */
export function getClientWhatsAppLinks(confirmationData: WhatsAppConfirmationData): string[] {
  const message = generateClientWhatsAppMessage(confirmationData);
  
  return WEDDING_CLIENTS_WHATSAPP.map(phoneNumber => 
    generateWhatsAppLink(phoneNumber, message)
  );
}

/**
 * Open WhatsApp confirmations in browser (for client notification)
 * This will open WhatsApp web/app with pre-filled messages
 */
export function sendClientWhatsAppConfirmations(confirmationData: WhatsAppConfirmationData): void {
  const links = getClientWhatsAppLinks(confirmationData);
  
  // Open the first WhatsApp link (your number) automatically
  if (links.length > 0) {
    window.open(links[0], '_blank');
  }
  
  // Log other links for manual sending if needed
  if (links.length > 1) {
    console.log('Additional WhatsApp confirmation links:', links.slice(1));
  }
}

/**
 * Generate confirmation message for guest (if they don't have email)
 */
export function generateGuestConfirmationMessage(guestName: string, attendance: 'yes' | 'no'): string {
  const attendanceText = attendance === 'yes' ? 'confirmed your attendance' : 'confirmed you cannot attend';
  
  return `Hi ${guestName}! 🎉\n\n` +
         `Thank you for your RSVP! We've ${attendanceText} for Kirsten & Dale's wedding on October 31st, 2025.\n\n` +
         `📍 Cape Point Vineyards\n` +
         `📅 October 31st, 2025\n` +
         `⏰ 4:00 PM\n\n` +
         `If you need to make any changes, please contact us directly.\n\n` +
         `With love,\n` +
         `Kirsten & Dale 💕`;
}

export default {
  generateClientWhatsAppMessage,
  generateWhatsAppLink,
  getClientWhatsAppLinks,
  sendClientWhatsAppConfirmations,
  generateGuestConfirmationMessage
};