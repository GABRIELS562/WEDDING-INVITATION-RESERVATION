import { individualGuests } from '../data/individualGuests';
import type { IndividualGuest } from '../types';

// WhatsApp invitation service for sending personal RSVP URLs
export class WhatsAppInviteService {
  private baseUrl: string;

  constructor(baseUrl = 'https://kdwedding-1703zt7fk-gabriels-projects-036175f3.vercel.app') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generate WhatsApp invitation message for a guest
   */
  generateInviteMessage(guest: IndividualGuest): string {
    const rsvpUrl = `${this.baseUrl}/guest/${guest.token}`;
    
    const message = `🎊 *Kirsten & Dale's Wedding Invitation* 🎊

Dear ${guest.fullName},

You're cordially invited to celebrate our special day!

📅 *Date:* October 31st, 2025
⏰ *Time:* 4:00 PM Ceremony | 6:00 PM Reception  
📍 *Venue:* Cape Point Vineyards, Noordhoek, Cape Town

🔗 *Your Personal RSVP Link:*
${rsvpUrl}

${guest.plusOneEligible ? '👫 You are welcome to bring a plus-one!' : ''}

Please RSVP by *September 30th, 2025* so we can finalize our arrangements.

Looking forward to celebrating with you! 💕

With love,
Kirsten & Dale

#KirstenDaleWedding`;

    return message;
  }

  /**
   * Generate WhatsApp URL for sending invitation
   */
  generateWhatsAppUrl(guest: IndividualGuest, phoneNumber?: string): string {
    const message = this.generateInviteMessage(guest);
    const encodedMessage = encodeURIComponent(message);
    
    if (phoneNumber) {
      // Clean phone number (remove spaces, dashes, etc.)
      const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
      return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    } else {
      // Open WhatsApp with message ready to send
      return `https://wa.me/?text=${encodedMessage}`;
    }
  }

  /**
   * Generate bulk invite data for all guests
   */
  generateBulkInviteData(): Array<{
    guest: IndividualGuest;
    message: string;
    whatsappUrl: string;
    rsvpUrl: string;
  }> {
    return individualGuests
      .filter(guest => guest.id !== 'jamie-test') // Exclude test guest
      .map(guest => ({
        guest,
        message: this.generateInviteMessage(guest),
        whatsappUrl: this.generateWhatsAppUrl(guest),
        rsvpUrl: `${this.baseUrl}/guest/${guest.token}`
      }));
  }

  /**
   * Generate CSV for bulk WhatsApp sending
   */
  generateBulkInviteCSV(): string {
    const inviteData = this.generateBulkInviteData();
    
    const headers = [
      'Guest Name',
      'Guest Token',
      'RSVP URL',
      'WhatsApp URL',
      'Plus One Eligible',
      'Message Preview'
    ];

    const rows = inviteData.map(item => [
      `"${item.guest.fullName}"`,
      `"${item.guest.token}"`,
      `"${item.rsvpUrl}"`,
      `"${item.whatsappUrl}"`,
      `"${item.guest.plusOneEligible ? 'YES' : 'NO'}"`,
      `"${item.message.substring(0, 100)}..."`
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  /**
   * Get guest by name for quick lookup
   */
  findGuestByName(name: string): IndividualGuest | undefined {
    return individualGuests.find(guest => 
      guest.fullName.toLowerCase().includes(name.toLowerCase())
    );
  }

  /**
   * Generate reminder message for guests who haven't RSVP'd
   */
  generateReminderMessage(guest: IndividualGuest): string {
    const rsvpUrl = `${this.baseUrl}/guest/${guest.token}`;
    
    return `👋 Hi ${guest.fullName}!

This is a gentle reminder about Kirsten & Dale's wedding on *October 31st, 2025* at Cape Point Vineyards.

We haven't received your RSVP yet and would love to know if you'll be joining us for our special day! 💕

🔗 *Please RSVP here:*
${rsvpUrl}

*RSVP Deadline: September 30th, 2025*

Thank you! 🎊

With love,
Kirsten & Dale`;
  }

  /**
   * Generate individual guest invitation URLs for manual sending
   */
  generateAllGuestUrls(): Array<{
    name: string;
    token: string;
    rsvpUrl: string;
    whatsappUrl: string;
  }> {
    return individualGuests
      .filter(guest => guest.id !== 'jamie-test')
      .map(guest => ({
        name: guest.fullName,
        token: guest.token,
        rsvpUrl: `${this.baseUrl}/guest/${guest.token}`,
        whatsappUrl: this.generateWhatsAppUrl(guest)
      }));
  }
}

// Export default service instance
export const whatsappInviteService = new WhatsAppInviteService();

// Export convenience functions
export function generateGuestInviteMessage(guestName: string): string | null {
  const guest = whatsappInviteService.findGuestByName(guestName);
  if (!guest) return null;
  return whatsappInviteService.generateInviteMessage(guest);
}

export function generateGuestWhatsAppUrl(guestName: string, phoneNumber?: string): string | null {
  const guest = whatsappInviteService.findGuestByName(guestName);
  if (!guest) return null;
  return whatsappInviteService.generateWhatsAppUrl(guest, phoneNumber);
}

export function getAllGuestTokens(): Array<{ name: string; token: string; url: string }> {
  return individualGuests
    .filter(guest => guest.id !== 'jamie-test')
    .map(guest => ({
      name: guest.fullName,
      token: guest.token,
      url: `https://kdwedding-1703zt7fk-gabriels-projects-036175f3.vercel.app/guest/${guest.token}`
    }));
}