/**
 * Admin Supabase Service
 * Dale & Kirsten's Wedding Admin Dashboard
 * 
 * Comprehensive database operations for admin functionality
 */

import { createClient } from '@supabase/supabase-js';
import { 
  WeddingStatistics, 
  GuestListItem, 
  GuestFilters, 
  AdminApiResponse,
  ManualRSVPEntry,
  ExportData,
  AdminNotification,
  ResponseTimelineData,
  MealChoiceStats
} from '@/types/admin';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

class AdminSupabaseService {
  /**
   * Get comprehensive wedding statistics
   */
  async getWeddingStatistics(): Promise<AdminApiResponse<WeddingStatistics>> {
    try {
      // Get all guests and RSVPs
      const { data: guests, error: guestsError } = await supabase
        .from('guests')
        .select(`
          *,
          rsvps (
            attending,
            meal_choice,
            dietary_restrictions,
            email_confirmation_sent,
            submitted_at,
            updated_at
          )
        `);

      if (guestsError) throw guestsError;

      // Calculate statistics
      const totalGuests = guests?.length || 0;
      const guestResponses = guests?.filter(g => g.rsvps?.length > 0) || [];
      const totalResponses = guestResponses.length;
      
      const attendingCount = guestResponses.filter(g => 
        g.rsvps?.[0]?.attending === true
      ).length;
      
      const notAttendingCount = guestResponses.filter(g => 
        g.rsvps?.[0]?.attending === false
      ).length;
      
      const pendingCount = totalGuests - totalResponses;
      const responseRate = totalGuests > 0 ? (totalResponses / totalGuests) * 100 : 0;
      
      const emailConfirmationsSent = guestResponses.filter(g => 
        g.rsvps?.[0]?.email_confirmation_sent === true
      ).length;

      // Calculate meal choice breakdown
      const mealChoices = guestResponses
        .map(g => g.rsvps?.[0]?.meal_choice)
        .filter(Boolean);
      
      const mealChoiceBreakdown: MealChoiceStats = {};
      mealChoices.forEach(choice => {
        if (choice) {
          mealChoiceBreakdown[choice] = mealChoiceBreakdown[choice] || { count: 0, percentage: 0 };
          mealChoiceBreakdown[choice].count++;
        }
      });

      // Calculate percentages
      Object.keys(mealChoiceBreakdown).forEach(choice => {
        mealChoiceBreakdown[choice].percentage = 
          (mealChoiceBreakdown[choice].count / attendingCount) * 100;
      });

      // Get response timeline
      const responseTimeline = await this.getResponseTimeline();

      const statistics: WeddingStatistics = {
        totalGuests,
        totalResponses,
        attendingCount,
        notAttendingCount,
        pendingCount,
        responseRate: Math.round(responseRate * 100) / 100,
        emailConfirmationsSent,
        mealChoiceBreakdown,
        responseTimeline,
        lastUpdated: new Date().toISOString()
      };

      return { success: true, data: statistics };

    } catch (error) {
      console.error('Error getting wedding statistics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get statistics'
      };
    }
  }

  /**
   * Get filtered guest list with pagination
   */
  async getGuestList(
    filters: GuestFilters,
    page: number = 1,
    limit: number = 50
  ): Promise<AdminApiResponse<GuestListItem[]>> {
    try {
      let query = supabase
        .from('guests')
        .select(`
          *,
          rsvps (
            attending,
            meal_choice,
            dietary_restrictions,
            email_confirmation_sent,
            submitted_at,
            updated_at
          )
        `);

      // Apply filters
      if (filters.search) {
        query = query.ilike('guest_name', `%${filters.search}%`);
      }

      // Get data
      const { data: guests, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });

      if (error) throw error;

      // Transform data to match GuestListItem interface
      const guestList: GuestListItem[] = guests?.map(guest => {
        const rsvp = guest.rsvps?.[0];
        return {
          id: guest.id,
          guest_name: guest.guest_name,
          email_address: guest.email_address,
          whatsapp_number: guest.whatsapp_number,
          guest_token: guest.guest_token,
          attending: rsvp?.attending,
          meal_choice: rsvp?.meal_choice,
          dietary_restrictions: rsvp?.dietary_restrictions,
          email_confirmation_sent: rsvp?.email_confirmation_sent || false,
          submitted_at: rsvp?.submitted_at,
          updated_at: rsvp?.updated_at,
          rsvp_status: rsvp ? (rsvp.attending ? 'attending' : 'not_attending') : 'pending',
          has_plus_one: guest.has_plus_one || false,
          is_child: guest.is_child || false,
          invitation_sent: guest.invitation_sent || false,
          whatsapp_link: guest.whatsapp_number ? 
            `https://wa.me/${guest.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
              `Hi ${guest.guest_name}! Dale & Kirsten would love for you to RSVP for their wedding. Please use this link: ${process.env.NEXT_PUBLIC_SITE_URL}/rsvp?token=${guest.guest_token}`
            )}` : undefined
        };
      }) || [];

      // Apply additional filters
      const filteredGuests = this.applyClientSideFilters(guestList, filters);

      return {
        success: true,
        data: filteredGuests,
        meta: {
          total: count || 0,
          page,
          limit,
          hasMore: (count || 0) > page * limit
        }
      };

    } catch (error) {
      console.error('Error getting guest list:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get guest list'
      };
    }
  }

  /**
   * Update guest information
   */
  async updateGuest(guestId: string, updates: Partial<GuestListItem>): Promise<AdminApiResponse<void>> {
    try {
      // Separate guest updates from RSVP updates
      const guestUpdates: any = {};
      const rsvpUpdates: any = {};

      // Guest table fields
      if (updates.guest_name !== undefined) guestUpdates.guest_name = updates.guest_name;
      if (updates.email_address !== undefined) guestUpdates.email_address = updates.email_address;
      if (updates.whatsapp_number !== undefined) guestUpdates.whatsapp_number = updates.whatsapp_number;
      if (updates.has_plus_one !== undefined) guestUpdates.has_plus_one = updates.has_plus_one;
      if (updates.is_child !== undefined) guestUpdates.is_child = updates.is_child;
      if (updates.invitation_sent !== undefined) guestUpdates.invitation_sent = updates.invitation_sent;

      // RSVP table fields
      if (updates.attending !== undefined) rsvpUpdates.attending = updates.attending;
      if (updates.meal_choice !== undefined) rsvpUpdates.meal_choice = updates.meal_choice;
      if (updates.dietary_restrictions !== undefined) rsvpUpdates.dietary_restrictions = updates.dietary_restrictions;
      if (updates.email_confirmation_sent !== undefined) rsvpUpdates.email_confirmation_sent = updates.email_confirmation_sent;

      // Update guest table
      if (Object.keys(guestUpdates).length > 0) {
        const { error: guestError } = await supabase
          .from('guests')
          .update(guestUpdates)
          .eq('id', guestId);

        if (guestError) throw guestError;
      }

      // Update or create RSVP
      if (Object.keys(rsvpUpdates).length > 0) {
        rsvpUpdates.updated_at = new Date().toISOString();

        // Check if RSVP exists
        const { data: existingRsvp } = await supabase
          .from('rsvps')
          .select('id')
          .eq('guest_id', guestId)
          .single();

        if (existingRsvp) {
          // Update existing RSVP
          const { error: rsvpError } = await supabase
            .from('rsvps')
            .update(rsvpUpdates)
            .eq('guest_id', guestId);

          if (rsvpError) throw rsvpError;
        } else {
          // Create new RSVP
          const { error: rsvpError } = await supabase
            .from('rsvps')
            .insert({
              guest_id: guestId,
              submitted_at: new Date().toISOString(),
              ...rsvpUpdates
            });

          if (rsvpError) throw rsvpError;
        }
      }

      return { success: true };

    } catch (error) {
      console.error('Error updating guest:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update guest'
      };
    }
  }

  /**
   * Submit manual RSVP entry
   */
  async submitManualRSVP(entry: ManualRSVPEntry): Promise<AdminApiResponse<string>> {
    try {
      // Get guest ID from token
      const { data: guest, error: guestError } = await supabase
        .from('guests')
        .select('id')
        .eq('guest_token', entry.guest_token)
        .single();

      if (guestError || !guest) {
        throw new Error('Guest not found');
      }

      // Create RSVP
      const rsvpData = {
        guest_id: guest.id,
        attending: entry.attending,
        meal_choice: entry.meal_choice,
        dietary_restrictions: entry.dietary_restrictions,
        email_address: entry.email_address,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        submitted_by_admin: true
      };

      const { data: rsvp, error: rsvpError } = await supabase
        .from('rsvps')
        .insert(rsvpData)
        .select('id')
        .single();

      if (rsvpError) throw rsvpError;

      return { success: true, data: rsvp.id };

    } catch (error) {
      console.error('Error submitting manual RSVP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit RSVP'
      };
    }
  }

  /**
   * Export guest data
   */
  async exportGuestData(filters: GuestFilters): Promise<AdminApiResponse<ExportData>> {
    try {
      // Get all matching guests
      const { data: guests } = await this.getGuestList(filters, 1, 10000);
      
      if (!guests) throw new Error('No data to export');

      // Format data for export
      const exportData = guests.map(guest => ({
        'Guest Name': guest.guest_name,
        'Email': guest.email_address || '',
        'WhatsApp': guest.whatsapp_number || '',
        'RSVP Status': guest.rsvp_status,
        'Attending': guest.attending === true ? 'Yes' : guest.attending === false ? 'No' : 'Pending',
        'Meal Choice': guest.meal_choice || '',
        'Dietary Restrictions': guest.dietary_restrictions || '',
        'Email Confirmation Sent': guest.email_confirmation_sent ? 'Yes' : 'No',
        'Has Plus One': guest.has_plus_one ? 'Yes' : 'No',
        'Is Child': guest.is_child ? 'Yes' : 'No',
        'Invitation Sent': guest.invitation_sent ? 'Yes' : 'No',
        'Submitted At': guest.submitted_at || '',
        'Updated At': guest.updated_at || ''
      }));

      const filename = `wedding-rsvp-export-${new Date().toISOString().split('T')[0]}.csv`;

      return {
        success: true,
        data: {
          filename,
          data: exportData,
          mimeType: 'text/csv'
        }
      };

    } catch (error) {
      console.error('Error exporting data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export data'
      };
    }
  }

  /**
   * Subscribe to real-time updates
   */
  subscribeToRSVPUpdates(
    onUpdate: (payload: any) => void,
    onError?: (error: Error) => void
  ) {
    try {
      const channel = supabase
        .channel('rsvp-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rsvps'
          },
          onUpdate
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'guests'
          },
          onUpdate
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };

    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Subscription failed'));
      }
      return () => {};
    }
  }

  /**
   * Get recent activity for notifications
   */
  async getRecentActivity(limit: number = 10): Promise<AdminApiResponse<AdminNotification[]>> {
    try {
      const { data: recentRsvps, error } = await supabase
        .from('rsvps')
        .select(`
          *,
          guests (guest_name)
        `)
        .order('submitted_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const notifications: AdminNotification[] = recentRsvps?.map(rsvp => ({
        id: rsvp.id,
        type: rsvp.updated_at && rsvp.updated_at !== rsvp.submitted_at ? 'updated_rsvp' : 'new_rsvp',
        title: rsvp.attending ? 'New RSVP - Attending' : 'New RSVP - Not Attending',
        message: `${rsvp.guests?.guest_name} has ${rsvp.attending ? 'accepted' : 'declined'} the invitation`,
        guest_name: rsvp.guests?.guest_name,
        timestamp: rsvp.submitted_at,
        read: false
      })) || [];

      return { success: true, data: notifications };

    } catch (error) {
      console.error('Error getting recent activity:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get recent activity'
      };
    }
  }

  // Private helper methods

  private async getResponseTimeline(): Promise<ResponseTimelineData[]> {
    try {
      const { data: rsvps, error } = await supabase
        .from('rsvps')
        .select('submitted_at')
        .order('submitted_at', { ascending: true });

      if (error) throw error;

      // Group by date
      const dateGroups: { [key: string]: number } = {};
      rsvps?.forEach(rsvp => {
        const date = new Date(rsvp.submitted_at).toISOString().split('T')[0];
        dateGroups[date] = (dateGroups[date] || 0) + 1;
      });

      // Convert to timeline format
      let cumulative = 0;
      return Object.entries(dateGroups).map(([date, responses]) => {
        cumulative += responses;
        return { date, responses, cumulative };
      });

    } catch (error) {
      console.error('Error getting response timeline:', error);
      return [];
    }
  }

  private applyClientSideFilters(guests: GuestListItem[], filters: GuestFilters): GuestListItem[] {
    return guests.filter(guest => {
      // RSVP Status filter
      if (filters.rsvpStatus !== 'all' && guest.rsvp_status !== filters.rsvpStatus) {
        return false;
      }

      // Meal choice filter
      if (filters.mealChoice && guest.meal_choice !== filters.mealChoice) {
        return false;
      }

      // Email confirmation filter
      if (filters.emailConfirmation !== 'all') {
        const hasEmailConfirmation = guest.email_confirmation_sent;
        if (filters.emailConfirmation === 'sent' && !hasEmailConfirmation) return false;
        if (filters.emailConfirmation === 'not_sent' && hasEmailConfirmation) return false;
      }

      // Invitation sent filter
      if (filters.invitationSent !== 'all') {
        const invitationSent = guest.invitation_sent;
        if (filters.invitationSent === 'sent' && !invitationSent) return false;
        if (filters.invitationSent === 'not_sent' && invitationSent) return false;
      }

      return true;
    });
  }
}

// Export singleton instance
export const adminSupabase = new AdminSupabaseService();
export default adminSupabase;