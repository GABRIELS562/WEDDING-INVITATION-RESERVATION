/**
 * RSVP Viewer - Display RSVPs in Excel Column Format
 * Dale & Kirsten's Wedding - Admin Dashboard
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseService';

interface RSVPRecord {
  id: number;
  guest_token: string;
  guest_name: string;
  attending: boolean;
  meal_choice: string | null;
  dietary_restrictions: string | null;
  email_address: string | null;
  email_confirmation_sent: boolean;
  submission_id: string | null;
  whatsapp_number: string | null;
  whatsapp_confirmation: boolean;
  special_requests: string | null;
  submitted_at: string;
}

const RSVPViewer: React.FC = () => {
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        throw error;
      }

      setRsvps(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch RSVPs');
      console.error('Error fetching RSVPs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
        <span className="ml-2">Loading RSVPs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error Loading RSVPs</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={fetchRSVPs}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">RSVP Responses</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {rsvps.length} total responses
            </span>
            <button
              onClick={fetchRSVPs}
              className="px-3 py-1 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest Token
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attending
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Meal Choice
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dietary Restrictions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Confirmation Sent
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submission ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                WhatsApp Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                WhatsApp Confirmation
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Special Requests
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rsvps.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                  No RSVP responses yet. Waiting for guests to respond...
                </td>
              </tr>
            ) : (
              rsvps.map((rsvp) => (
                <tr key={rsvp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {rsvp.guest_token}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {rsvp.guest_name}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rsvp.attending 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {rsvp.attending ? 'YES' : 'NO'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {rsvp.meal_choice || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                    {rsvp.dietary_restrictions || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {rsvp.email_address || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rsvp.email_confirmation_sent 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rsvp.email_confirmation_sent ? 'YES' : 'NO'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                    {rsvp.submission_id || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {rsvp.whatsapp_number || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rsvp.whatsapp_confirmation 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rsvp.whatsapp_confirmation ? 'YES' : 'NO'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                    {rsvp.special_requests || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(rsvp.submitted_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {rsvps.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Total Responses:</span>
              <span className="ml-1 text-gray-600">{rsvps.length}</span>
            </div>
            <div>
              <span className="font-medium text-green-800">Attending:</span>
              <span className="ml-1 text-green-600">
                {rsvps.filter(r => r.attending).length}
              </span>
            </div>
            <div>
              <span className="font-medium text-red-800">Not Attending:</span>
              <span className="ml-1 text-red-600">
                {rsvps.filter(r => !r.attending).length}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-800">With Emails:</span>
              <span className="ml-1 text-blue-600">
                {rsvps.filter(r => r.email_address).length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RSVPViewer;