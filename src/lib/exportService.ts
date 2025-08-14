/**
 * Data Export Service
 * Dale & Kirsten's Wedding Admin Dashboard
 * 
 * Service for exporting guest data in various formats
 */

import { GuestListItem, ExportOptions, ExportData } from '@/types/admin';

class ExportService {
  /**
   * Export guest data to CSV format
   */
  exportToCSV(guests: GuestListItem[], options: Partial<ExportOptions> = {}): ExportData {
    const headers: string[] = ['Guest Name', 'RSVP Status', 'Attending'];

    // Add optional columns based on options
    if (options.includeEmails !== false) {
      headers.push('Email Address');
    }
    if (options.includeWhatsApp !== false) {
      headers.push('WhatsApp Number');
    }
    if (options.includeDietary !== false) {
      headers.push('Meal Choice', 'Dietary Restrictions');
    }

    headers.push(
      'Email Confirmation Sent',
      'Has Plus One',
      'Is Child',
      'Invitation Sent',
      'Response Date',
      'Last Updated'
    );

    // Create CSV rows
    const rows = guests.map(guest => {
      const row: string[] = [
        this.escapeCSV(guest.guest_name),
        this.escapeCSV(guest.rsvp_status),
        guest.attending === true ? 'Yes' : guest.attending === false ? 'No' : 'Pending'
      ];

      if (options.includeEmails !== false) {
        row.push(this.escapeCSV(guest.email_address || ''));
      }
      if (options.includeWhatsApp !== false) {
        row.push(this.escapeCSV(guest.whatsapp_number || ''));
      }
      if (options.includeDietary !== false) {
        row.push(
          this.escapeCSV(guest.meal_choice || ''),
          this.escapeCSV(guest.dietary_restrictions || '')
        );
      }

      row.push(
        guest.email_confirmation_sent ? 'Yes' : 'No',
        guest.has_plus_one ? 'Yes' : 'No',
        guest.is_child ? 'Yes' : 'No',
        guest.invitation_sent ? 'Yes' : 'No',
        this.escapeCSV(guest.submitted_at ? new Date(guest.submitted_at).toLocaleDateString() : ''),
        this.escapeCSV(guest.updated_at ? new Date(guest.updated_at).toLocaleDateString() : '')
      );

      return row;
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const filename = `wedding-rsvp-export-${new Date().toISOString().split('T')[0]}.csv`;

    return {
      filename,
      data: csvContent,
      mimeType: 'text/csv'
    };
  }

  /**
   * Export meal planning data to CSV
   */
  exportMealPlanningCSV(guests: GuestListItem[]): ExportData {
    const attendingGuests = guests.filter(g => g.attending === true);
    
    // Group by meal choice
    const mealGroups: { [key: string]: GuestListItem[] } = {};
    attendingGuests.forEach(guest => {
      const mealChoice = guest.meal_choice || 'Not specified';
      if (!mealGroups[mealChoice]) {
        mealGroups[mealChoice] = [];
      }
      mealGroups[mealChoice].push(guest);
    });

    const headers = ['Meal Choice', 'Guest Count', 'Guest Names', 'Dietary Restrictions'];
    const rows = Object.entries(mealGroups).map(([mealChoice, guestList]) => {
      const guestNames = guestList.map(g => g.guest_name).join('; ');
      const dietaryRestrictions = guestList
        .map(g => g.dietary_restrictions)
        .filter(Boolean)
        .join('; ') || 'None';

      return [
        this.escapeCSV(mealChoice),
        guestList.length.toString(),
        this.escapeCSV(guestNames),
        this.escapeCSV(dietaryRestrictions)
      ];
    });

    // Add summary row
    rows.unshift([
      'TOTAL ATTENDING',
      attendingGuests.length.toString(),
      '',
      ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const filename = `wedding-meal-planning-${new Date().toISOString().split('T')[0]}.csv`;

    return {
      filename,
      data: csvContent,
      mimeType: 'text/csv'
    };
  }

  /**
   * Export email list for communication
   */
  exportEmailListCSV(guests: GuestListItem[]): ExportData {
    const guestsWithEmail = guests.filter(g => g.email_address);
    
    const headers = ['Name', 'Email', 'RSVP Status', 'Attending'];
    const rows = guestsWithEmail.map(guest => [
      this.escapeCSV(guest.guest_name),
      this.escapeCSV(guest.email_address || ''),
      this.escapeCSV(guest.rsvp_status),
      guest.attending === true ? 'Yes' : guest.attending === false ? 'No' : 'Pending'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const filename = `wedding-email-list-${new Date().toISOString().split('T')[0]}.csv`;

    return {
      filename,
      data: csvContent,
      mimeType: 'text/csv'
    };
  }

  /**
   * Export dietary restrictions report
   */
  exportDietaryRestrictionsCSV(guests: GuestListItem[]): ExportData {
    const attendingGuests = guests.filter(g => g.attending === true);
    const guestsWithDietary = attendingGuests.filter(g => g.dietary_restrictions);

    const headers = ['Guest Name', 'Meal Choice', 'Dietary Restrictions', 'Contact Email'];
    const rows = guestsWithDietary.map(guest => [
      this.escapeCSV(guest.guest_name),
      this.escapeCSV(guest.meal_choice || ''),
      this.escapeCSV(guest.dietary_restrictions || ''),
      this.escapeCSV(guest.email_address || '')
    ]);

    // Add summary
    const summaryRows = [
      ['SUMMARY', '', '', ''],
      ['Total Attending:', attendingGuests.length.toString(), '', ''],
      ['With Dietary Restrictions:', guestsWithDietary.length.toString(), '', ''],
      ['Percentage:', `${((guestsWithDietary.length / attendingGuests.length) * 100).toFixed(1)}%`, '', '']
    ];

    const csvContent = [headers, ...rows, [''], ...summaryRows]
      .map(row => row.join(','))
      .join('\n');

    const filename = `wedding-dietary-restrictions-${new Date().toISOString().split('T')[0]}.csv`;

    return {
      filename,
      data: csvContent,
      mimeType: 'text/csv'
    };
  }

  /**
   * Export WhatsApp contact list
   */
  exportWhatsAppContactsCSV(guests: GuestListItem[]): ExportData {
    const guestsWithWhatsApp = guests.filter(g => g.whatsapp_number);
    
    const headers = ['Name', 'WhatsApp Number', 'RSVP Status', 'WhatsApp Invite Link'];
    const rows = guestsWithWhatsApp.map(guest => [
      this.escapeCSV(guest.guest_name),
      this.escapeCSV(guest.whatsapp_number || ''),
      this.escapeCSV(guest.rsvp_status),
      this.escapeCSV(guest.whatsapp_link || '')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const filename = `wedding-whatsapp-contacts-${new Date().toISOString().split('T')[0]}.csv`;

    return {
      filename,
      data: csvContent,
      mimeType: 'text/csv'
    };
  }

  /**
   * Download file to user's device
   */
  downloadFile(exportData: ExportData): void {
    try {
      const blob = new Blob([exportData.data], { type: exportData.mimeType });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = exportData.filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Failed to download file');
    }
  }

  /**
   * Generate and download guest list export
   */
  async downloadGuestList(
    guests: GuestListItem[], 
    options: Partial<ExportOptions> = {}
  ): Promise<void> {
    const exportData = this.exportToCSV(guests, options);
    this.downloadFile(exportData);
  }

  /**
   * Generate and download meal planning export
   */
  async downloadMealPlanning(guests: GuestListItem[]): Promise<void> {
    const exportData = this.exportMealPlanningCSV(guests);
    this.downloadFile(exportData);
  }

  /**
   * Generate and download email list export
   */
  async downloadEmailList(guests: GuestListItem[]): Promise<void> {
    const exportData = this.exportEmailListCSV(guests);
    this.downloadFile(exportData);
  }

  /**
   * Generate and download dietary restrictions export
   */
  async downloadDietaryRestrictions(guests: GuestListItem[]): Promise<void> {
    const exportData = this.exportDietaryRestrictionsCSV(guests);
    this.downloadFile(exportData);
  }

  /**
   * Generate and download WhatsApp contacts export
   */
  async downloadWhatsAppContacts(guests: GuestListItem[]): Promise<void> {
    const exportData = this.exportWhatsAppContactsCSV(guests);
    this.downloadFile(exportData);
  }

  /**
   * Get export statistics
   */
  getExportStatistics(guests: GuestListItem[]): {
    totalGuests: number;
    withEmail: number;
    withWhatsApp: number;
    withDietary: number;
    attending: number;
    notAttending: number;
    pending: number;
  } {
    return {
      totalGuests: guests.length,
      withEmail: guests.filter(g => g.email_address).length,
      withWhatsApp: guests.filter(g => g.whatsapp_number).length,
      withDietary: guests.filter(g => g.dietary_restrictions).length,
      attending: guests.filter(g => g.attending === true).length,
      notAttending: guests.filter(g => g.attending === false).length,
      pending: guests.filter(g => g.attending === null || g.attending === undefined).length
    };
  }

  // Private helper methods

  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private formatDate(date: string | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private formatDateTime(date: string | null): string {
    if (!date) return '';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Export singleton instance
export const exportService = new ExportService();
export default exportService;