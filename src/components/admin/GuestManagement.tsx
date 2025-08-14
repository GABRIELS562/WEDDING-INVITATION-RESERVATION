/**
 * Guest Management Component
 * Dale & Kirsten's Wedding Admin Dashboard
 * 
 * Comprehensive guest list management with search, filters, and actions
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { GuestListItem, MEAL_CHOICES } from '@/types/admin';
import type { GuestFilters } from '@/types/admin';
import adminSupabase from '@/lib/adminSupabase';

interface GuestManagementProps {
  className?: string;
}

interface GuestRowProps {
  guest: GuestListItem;
  onEdit: (guest: GuestListItem) => void;
  onSelect: (guestId: string) => void;
  isSelected: boolean;
}

// Guest Status Badge Component
const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const statusConfig = {
    pending: { color: 'yellow', label: 'Pending', icon: ClockIcon },
    attending: { color: 'green', label: 'Attending', icon: CheckCircleIcon },
    not_attending: { color: 'red', label: 'Not Attending', icon: XCircleIcon },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
      colorClasses[config.color as keyof typeof colorClasses],
      className
    )}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

// Guest Table Row Component
const GuestRow: React.FC<GuestRowProps> = ({ guest, onEdit, onSelect, isSelected }) => {
  const [showActions, setShowActions] = useState(false);

  const handleWhatsAppClick = () => {
    if (guest.whatsapp_link) {
      window.open(guest.whatsapp_link, '_blank');
    }
  };

  const copyWhatsAppLink = async () => {
    if (guest.whatsapp_link) {
      try {
        await navigator.clipboard.writeText(guest.whatsapp_link);
        // TODO: Show success toast
      } catch (error) {
        console.error('Failed to copy WhatsApp link:', error);
      }
    }
  };

  return (
    <motion.tr
      className={cn(
        'border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200',
        isSelected && 'bg-rose-50'
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Selection Checkbox */}
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(guest.id)}
          className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
        />
      </td>

      {/* Guest Name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {guest.guest_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{guest.guest_name}</div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              {guest.is_child && (
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Child</span>
              )}
              {guest.has_plus_one && (
                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">+1</span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Contact Info */}
      <td className="px-4 py-3">
        <div className="space-y-1">
          {guest.email_address ? (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <EnvelopeIcon className="w-3 h-3" />
              <span className="truncate max-w-40">{guest.email_address}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-400">No email</span>
          )}
          {guest.whatsapp_number ? (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <PhoneIcon className="w-3 h-3" />
              <span>{guest.whatsapp_number}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-400">No WhatsApp</span>
          )}
        </div>
      </td>

      {/* RSVP Status */}
      <td className="px-4 py-3">
        <StatusBadge status={guest.rsvp_status} />
      </td>

      {/* Meal Choice */}
      <td className="px-4 py-3">
        {guest.meal_choice ? (
          <span className="text-sm text-gray-900 capitalize">
            {guest.meal_choice.replace('_', ' ')}
          </span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      {/* Email Confirmation */}
      <td className="px-4 py-3">
        {guest.email_confirmation_sent ? (
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
        ) : (
          <XCircleIcon className="w-5 h-5 text-gray-300" />
        )}
      </td>

      {/* Last Activity */}
      <td className="px-4 py-3">
        {guest.submitted_at ? (
          <div className="text-sm text-gray-600">
            {new Date(guest.submitted_at).toLocaleDateString()}
          </div>
        ) : (
          <span className="text-sm text-gray-400">No response</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
          </button>

          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-8 z-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-48"
                onMouseLeave={() => setShowActions(false)}
              >
                <button
                  onClick={() => {
                    onEdit(guest);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Guest
                </button>

                {guest.whatsapp_number && (
                  <>
                    <button
                      onClick={() => {
                        handleWhatsAppClick();
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      Send WhatsApp
                    </button>
                    <button
                      onClick={() => {
                        copyWhatsAppLink();
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Copy WhatsApp Link
                    </button>
                  </>
                )}

                {guest.email_address && (
                  <button
                    onClick={() => {
                      window.location.href = `mailto:${guest.email_address}?subject=Dale & Kirsten's Wedding RSVP`;
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    Send Email
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </td>
    </motion.tr>
  );
};

// Filters Component
const GuestFilters: React.FC<{
  filters: GuestFilters;
  onFiltersChange: (filters: Partial<GuestFilters>) => void;
  guestCount: number;
}> = ({ filters, onFiltersChange, guestCount }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search guests..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {guestCount} guest{guestCount !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 transition-colors duration-200',
              showFilters ? 'bg-rose-50 border-rose-300 text-rose-700' : 'hover:bg-gray-50'
            )}
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-lg p-4 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* RSVP Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RSVP Status
                </label>
                <select
                  value={filters.rsvpStatus}
                  onChange={(e) => onFiltersChange({ rsvpStatus: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="attending">Attending</option>
                  <option value="not_attending">Not Attending</option>
                </select>
              </div>

              {/* Meal Choice Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Choice
                </label>
                <select
                  value={filters.mealChoice}
                  onChange={(e) => onFiltersChange({ mealChoice: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">All Meals</option>
                  {MEAL_CHOICES.map((meal) => (
                    <option key={meal.value} value={meal.value}>
                      {meal.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email Confirmation Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Confirmation
                </label>
                <select
                  value={filters.emailConfirmation}
                  onChange={(e) => onFiltersChange({ emailConfirmation: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="all">All</option>
                  <option value="sent">Sent</option>
                  <option value="not_sent">Not Sent</option>
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => onFiltersChange({ sortBy: e.target.value as any })}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="name">Name</option>
                    <option value="submitted_at">Response Date</option>
                    <option value="updated_at">Last Updated</option>
                  </select>
                  <button
                    onClick={() => onFiltersChange({ 
                      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex justify-end">
              <button
                onClick={() => onFiltersChange({
                  search: '',
                  rsvpStatus: 'all',
                  mealChoice: '',
                  emailConfirmation: 'all',
                  sortBy: 'name',
                  sortOrder: 'asc'
                })}
                className="text-sm text-rose-600 hover:text-rose-700"
              >
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GuestManagement: React.FC<GuestManagementProps> = ({ className }) => {
  const [guests, setGuests] = useState<GuestListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [editingGuest, setEditingGuest] = useState<GuestListItem | null>(null);
  
  const [filters, setFilters] = useState<GuestFilters>({
    search: '',
    rsvpStatus: 'all',
    mealChoice: '',
    emailConfirmation: 'all',
    invitationSent: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const loadGuests = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await adminSupabase.getGuestList(filters);
      if (result.success && result.data) {
        setGuests(result.data);
      }
    } catch (error) {
      console.error('Error loading guests:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  // Filter and sort guests
  const filteredGuests = useMemo(() => {
    let filtered = [...guests];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(guest =>
        guest.guest_name.toLowerCase().includes(searchLower) ||
        guest.email_address?.toLowerCase().includes(searchLower) ||
        guest.whatsapp_number?.includes(filters.search)
      );
    }

    // Apply other filters
    if (filters.rsvpStatus !== 'all') {
      filtered = filtered.filter(guest => guest.rsvp_status === filters.rsvpStatus);
    }

    if (filters.mealChoice) {
      filtered = filtered.filter(guest => guest.meal_choice === filters.mealChoice);
    }

    if (filters.emailConfirmation !== 'all') {
      filtered = filtered.filter(guest => {
        if (filters.emailConfirmation === 'sent') return guest.email_confirmation_sent;
        return !guest.email_confirmation_sent;
      });
    }

    // Sort guests
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.guest_name;
          bValue = b.guest_name;
          break;
        case 'submitted_at':
          aValue = a.submitted_at || '';
          bValue = b.submitted_at || '';
          break;
        case 'updated_at':
          aValue = a.updated_at || '';
          bValue = b.updated_at || '';
          break;
        default:
          aValue = a.guest_name;
          bValue = b.guest_name;
      }

      const comparison = aValue.localeCompare(bValue);
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [guests, filters]);

  const handleFiltersChange = (newFilters: Partial<GuestFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleGuestSelect = (guestId: string) => {
    setSelectedGuests(prev => 
      prev.includes(guestId)
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedGuests.length === filteredGuests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(filteredGuests.map(g => g.id));
    }
  };

  if (isLoading) {
    return (
      <div className={cn('p-6', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4" />
          <div className="h-10 bg-gray-300 rounded" />
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-300 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UserPlusIcon className="w-8 h-8 text-rose-500" />
            Guest Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage wedding invitations and RSVP responses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors duration-200">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg flex items-center gap-2 transition-colors duration-200">
            <PlusIcon className="w-4 h-4" />
            Add Guest
          </button>
        </div>
      </div>

      {/* Filters */}
      <GuestFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        guestCount={filteredGuests.length}
      />

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedGuests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center justify-between"
          >
            <span className="text-sm text-rose-700">
              {selectedGuests.length} guest{selectedGuests.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-white border border-rose-300 text-rose-700 rounded hover:bg-rose-50 transition-colors duration-200">
                Send Reminders
              </button>
              <button className="px-3 py-1 text-sm bg-white border border-rose-300 text-rose-700 rounded hover:bg-rose-50 transition-colors duration-200">
                Export Selected
              </button>
              <button
                onClick={() => setSelectedGuests([])}
                className="px-3 py-1 text-sm text-rose-600 hover:text-rose-700"
              >
                Clear Selection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedGuests.length === filteredGuests.length && filteredGuests.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meal
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Sent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredGuests.map((guest) => (
                  <GuestRow
                    key={guest.id}
                    guest={guest}
                    onEdit={setEditingGuest}
                    onSelect={handleGuestSelect}
                    isSelected={selectedGuests.includes(guest.id)}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredGuests.length === 0 && (
          <div className="text-center py-12">
            <UserPlusIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No guests found</h3>
            <p className="text-gray-500">
              {filters.search || filters.rsvpStatus !== 'all' || filters.mealChoice
                ? 'Try adjusting your filters to see more guests.'
                : 'Start by adding your wedding guests to the system.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestManagement;