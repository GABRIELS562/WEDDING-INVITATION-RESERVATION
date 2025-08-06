// Guest Token Generator and WhatsApp Link System

export interface GuestInfo {
  name: string;
  phone?: string;
  email?: string;
  groupName?: string; // e.g., "Smith Family", "Work Friends"
  allowsPlusOne?: boolean;
}

export interface GuestToken {
  token: string;
  name: string;
  whatsappLink: string;
  rsvpLink: string;
}

/**
 * Generate a unique guest token
 */
export function generateGuestToken(guestName: string): string {
  // Remove spaces and special characters, convert to uppercase
  const cleanName = guestName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
  // Take first 4 letters of name (or pad with X if shorter)
  const namePrefix = (cleanName + 'XXXX').substring(0, 4);
  
  // Generate random 4-digit number
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  
  // Generate random 2-letter suffix
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const suffix = letters.charAt(Math.floor(Math.random() * letters.length)) + 
                letters.charAt(Math.floor(Math.random() * letters.length));
  
  return `${namePrefix}${randomNumber}${suffix}`;
}

/**
 * Generate RSVP link for a guest
 */
export function generateRSVPLink(token: string, baseUrl: string = 'https://yourweddingwebsite.com'): string {
  return `${baseUrl}/guest/${token}`;
}

/**
 * Generate WhatsApp message for RSVP invitation
 */
export function generateWhatsAppMessage(guestName: string, rsvpLink: string): string {
  return `Hi ${guestName}! 💕

Kirsten & Dale are getting married! 

You're invited to celebrate with us on October 31st, 2025 at Cape Point Vineyards in Cape Town.

Please RSVP and choose your meal using this personalized link:
${rsvpLink}

We can't wait to celebrate with you! 🥂✨

#KirstenDaleWedding`;
}

/**
 * Generate WhatsApp link with pre-filled message
 */
export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  // Remove all non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  
  // Add country code if not present (assuming South African numbers)
  const formattedPhone = cleanPhone.startsWith('27') ? cleanPhone : `27${cleanPhone.replace(/^0/, '')}`;
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Generate guest tokens and WhatsApp links in bulk
 */
export function generateGuestInvitations(guests: GuestInfo[], baseUrl: string = 'https://yourweddingwebsite.com'): GuestToken[] {
  return guests.map(guest => {
    const token = generateGuestToken(guest.name);
    const rsvpLink = generateRSVPLink(token, baseUrl);
    const message = generateWhatsAppMessage(guest.name, rsvpLink);
    const whatsappLink = guest.phone ? generateWhatsAppLink(guest.phone, message) : '';
    
    return {
      token,
      name: guest.name,
      whatsappLink,
      rsvpLink
    };
  });
}

/**
 * Export guest list to CSV format for easy management
 */
export function exportGuestListToCSV(guestTokens: GuestToken[]): string {
  const headers = ['Guest Name', 'Token', 'RSVP Link', 'WhatsApp Link'];
  const rows = guestTokens.map(guest => [
    guest.name,
    guest.token,
    guest.rsvpLink,
    guest.whatsappLink
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
}

/**
 * Download CSV file with guest information
 */
export function downloadGuestListCSV(guestTokens: GuestToken[], filename: string = 'wedding-guests.csv'): void {
  const csvContent = exportGuestListToCSV(guestTokens);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Example usage and sample guest list
export const sampleGuestList: GuestInfo[] = [
  {
    name: "John Smith",
    phone: "0821234567",
    email: "john@example.com",
    allowsPlusOne: true
  },
  {
    name: "Sarah Johnson", 
    phone: "0829876543",
    email: "sarah@example.com",
    allowsPlusOne: false
  },
  {
    name: "The Williams Family",
    phone: "0824567890",
    email: "williams@example.com",
    groupName: "Family Friends",
    allowsPlusOne: false
  }
];

/**
 * Quick setup function to generate all guest invitations
 */
export function setupWeddingInvitations(
  guestList: GuestInfo[], 
  baseUrl: string = 'https://yourweddingwebsite.com'
): {
  guestTokens: GuestToken[];
  csvData: string;
  downloadCSV: () => void;
} {
  const guestTokens = generateGuestInvitations(guestList, baseUrl);
  const csvData = exportGuestListToCSV(guestTokens);
  
  return {
    guestTokens,
    csvData,
    downloadCSV: () => downloadGuestListCSV(guestTokens)
  };
}