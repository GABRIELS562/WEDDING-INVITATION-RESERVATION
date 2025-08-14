/**
 * WhatsApp Campaign Manager
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Comprehensive admin interface for WhatsApp link generation and campaign management
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  ClipboardDocumentIcon,
  PaperAirplaneIcon,
  EyeIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  UserGroupIcon,
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { 
  WhatsAppGuest, 
  WhatsAppCampaign, 
  WhatsAppTemplate, 
  WhatsAppAnalytics,
  GuestImportData 
} from '@/types/whatsapp';
import whatsappService from '@/lib/whatsappService';
import messageTemplateEngine from '@/lib/messageTemplateEngine';

interface WhatsAppCampaignManagerProps {
  className?: string;
}

// Statistics Card Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  trend?: { value: number; isPositive: boolean };
}> = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-600',
    green: 'from-green-500 to-green-600 text-green-600',
    yellow: 'from-yellow-500 to-yellow-600 text-yellow-600',
    red: 'from-red-500 to-red-600 text-red-600',
    purple: 'from-purple-500 to-purple-600 text-purple-600',
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center',
              colorClasses[color].replace('text-', 'from-').replace('to-', 'to-')
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              {trend && (
                <div className={cn(
                  'flex items-center gap-1 text-xs',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}>
                  <span>{trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className={cn('text-3xl font-bold', colorClasses[color])}>
              {value}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Guest Table Component
const WhatsAppGuestTable: React.FC<{
  guests: WhatsAppGuest[];
  selectedGuests: string[];
  onGuestSelect: (guestId: string) => void;
  onSelectAll: () => void;
  onCopyLink: (guest: WhatsAppGuest) => void;
  onSendMessage: (guest: WhatsAppGuest) => void;
  onPreviewMessage: (guest: WhatsAppGuest) => void;
}> = ({ 
  guests, 
  selectedGuests, 
  onGuestSelect, 
  onSelectAll, 
  onCopyLink, 
  onSendMessage,
  onPreviewMessage 
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.guest_name.toLowerCase().includes(search.toLowerCase()) ||
                         guest.phone_number.includes(search);
    const matchesStatus = statusFilter === 'all' || guest.campaign_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const config = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '📤' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
      clicked: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '👆' },
      responded: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
      bounced: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' },
    };

    const { bg, text, icon } = config[status as keyof typeof config] || config.pending;

    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', bg, text)}>
        <span>{icon}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">WhatsApp Guest Management</h3>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search guests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="clicked">Clicked</option>
              <option value="responded">Responded</option>
              <option value="bounced">Bounced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedGuests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between"
          >
            <span className="text-sm text-rose-700">
              {selectedGuests.length} guest{selectedGuests.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-white border border-rose-300 text-rose-700 rounded hover:bg-rose-50 transition-colors duration-200 flex items-center gap-1">
                <ClipboardDocumentIcon className="w-4 h-4" />
                Copy Links
              </button>
              <button className="px-3 py-1 text-sm bg-white border border-rose-300 text-rose-700 rounded hover:bg-rose-50 transition-colors duration-200 flex items-center gap-1">
                <PaperAirplaneIcon className="w-4 h-4" />
                Send Messages
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedGuests.length === filteredGuests.length && filteredGuests.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGuests.map((guest) => (
              <motion.tr
                key={guest.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedGuests.includes(guest.id)}
                    onChange={() => onGuestSelect(guest.id)}
                    className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {guest.guest_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{guest.guest_name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        {guest.has_plus_one && (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">+1</span>
                        )}
                        {guest.is_child && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Child</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{guest.phone_number}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    {guest.phone_valid ? (
                      <CheckCircleIcon className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-3 h-3 text-red-500" />
                    )}
                    {guest.phone_valid ? 'Valid' : 'Invalid'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={guest.campaign_status} />
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">Clicks:</span>
                      <span className="font-medium">{guest.click_count}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">RSVP:</span>
                      {guest.rsvp_completed ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPreviewMessage(guest)}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      title="Preview Message"
                    >
                      <EyeIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => onCopyLink(guest)}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      title="Copy WhatsApp Link"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => onSendMessage(guest)}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      title="Send WhatsApp Message"
                    >
                      <PaperAirplaneIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredGuests.length === 0 && (
        <div className="text-center py-12">
          <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No guests found</h3>
          <p className="text-gray-500">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your filters to see more guests.'
              : 'Start by importing your wedding guests.'}
          </p>
        </div>
      )}
    </div>
  );
};

// Message Preview Modal
const MessagePreviewModal: React.FC<{
  guest: WhatsAppGuest | null;
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  onTemplateChange: (templateId: string) => void;
}> = ({ guest, isOpen, onClose, templateId, onTemplateChange }) => {
  const [messagePreview, setMessagePreview] = useState('');
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);

  useEffect(() => {
    setTemplates(messageTemplateEngine.getAvailableTemplates());
  }, []);

  useEffect(() => {
    if (guest) {
      const preview = messageTemplateEngine.previewMessage(templateId);
      setMessagePreview(preview.message.replace('John Smith', guest.guest_name));
    }
  }, [guest, templateId]);

  if (!isOpen || !guest) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Message Preview</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <XCircleIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Preview for {guest.guest_name}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Template
              </label>
              <select
                value={templateId}
                onChange={(e) => onTemplateChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Preview
              </label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="bg-green-500 text-white p-3 rounded-lg max-w-xs ml-auto">
                  <pre className="whitespace-pre-wrap text-sm font-sans">
                    {messagePreview}
                  </pre>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Character count: {messagePreview.length} / 4096
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  if (guest.whatsapp_link) {
                    window.open(guest.whatsapp_link, '_blank');
                  }
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                Send via WhatsApp
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(messagePreview);
                  // TODO: Show toast notification
                }}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
              >
                <ClipboardDocumentIcon className="w-4 h-4" />
                Copy Message
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const WhatsAppCampaignManager: React.FC<WhatsAppCampaignManagerProps> = ({ className }) => {
  const [guests, setGuests] = useState<WhatsAppGuest[]>([]);
  const [analytics, setAnalytics] = useState<WhatsAppAnalytics | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewGuest, setPreviewGuest] = useState<WhatsAppGuest | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('formal_invitation');
  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'campaigns' | 'analytics'>('overview');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load guests
      const guestsResult = await whatsappService.getWhatsAppGuests();
      if (guestsResult.success && guestsResult.data) {
        setGuests(guestsResult.data);
      }

      // Load analytics
      const analyticsResult = await whatsappService.getCampaignAnalytics();
      if (analyticsResult.success && analyticsResult.data) {
        setAnalytics(analyticsResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGuestSelect = (guestId: string) => {
    setSelectedGuests(prev =>
      prev.includes(guestId)
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedGuests.length === guests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(guests.map(g => g.id));
    }
  };

  const handleCopyLink = async (guest: WhatsAppGuest) => {
    try {
      await navigator.clipboard.writeText(guest.whatsapp_link);
      // TODO: Show success toast
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleSendMessage = (guest: WhatsAppGuest) => {
    if (guest.whatsapp_link) {
      window.open(guest.whatsapp_link, '_blank');
    }
  };

  const handlePreviewMessage = (guest: WhatsAppGuest) => {
    setPreviewGuest(guest);
  };

  if (isLoading) {
    return (
      <div className={cn('p-6', className)}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-2xl" />
            ))}
          </div>
          <div className="h-96 bg-gray-300 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6 space-y-8', className)}>
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-500" />
            WhatsApp Campaign Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Generate secure RSVP links and manage WhatsApp invitations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors duration-200">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Import Guests
          </button>
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-colors duration-200">
            <PlusIcon className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'guests', label: 'Guests', icon: UserGroupIcon },
            { id: 'campaigns', label: 'Campaigns', icon: PaperAirplaneIcon },
            { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && analytics && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Guests"
                value={analytics.total_links_generated}
                subtitle="WhatsApp links generated"
                icon={UserGroupIcon}
                color="blue"
              />
              <StatCard
                title="Messages Sent"
                value={analytics.total_messages_sent}
                subtitle={`${analytics.total_messages_sent > 0 ? ((analytics.total_messages_sent / analytics.total_links_generated) * 100).toFixed(1) : 0}% of guests`}
                icon={PaperAirplaneIcon}
                color="green"
              />
              <StatCard
                title="Link Clicks"
                value={analytics.total_clicks}
                subtitle={`${analytics.click_through_rate.toFixed(1)}% CTR`}
                icon={LinkIcon}
                color="purple"
              />
              <StatCard
                title="RSVP Responses"
                value={analytics.total_responses}
                subtitle={`${analytics.response_rate.toFixed(1)}% response rate`}
                icon={CheckCircleIcon}
                color="yellow"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="bg-white/20 hover:bg-white/30 rounded-xl p-4 text-left transition-colors duration-200">
                  <h4 className="font-medium mb-1">Generate Links</h4>
                  <p className="text-sm opacity-90">Create WhatsApp RSVP links</p>
                </button>
                <button className="bg-white/20 hover:bg-white/30 rounded-xl p-4 text-left transition-colors duration-200">
                  <h4 className="font-medium mb-1">Send Campaign</h4>
                  <p className="text-sm opacity-90">Launch invitation messages</p>
                </button>
                <button className="bg-white/20 hover:bg-white/30 rounded-xl p-4 text-left transition-colors duration-200">
                  <h4 className="font-medium mb-1">Track Analytics</h4>
                  <p className="text-sm opacity-90">Monitor engagement</p>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'guests' && (
          <motion.div
            key="guests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <WhatsAppGuestTable
              guests={guests}
              selectedGuests={selectedGuests}
              onGuestSelect={handleGuestSelect}
              onSelectAll={handleSelectAll}
              onCopyLink={handleCopyLink}
              onSendMessage={handleSendMessage}
              onPreviewMessage={handlePreviewMessage}
            />
          </motion.div>
        )}

        {activeTab === 'campaigns' && (
          <motion.div
            key="campaigns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <PaperAirplaneIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Campaign Management</h3>
            <p className="text-gray-600 mb-6">Create and manage WhatsApp invitation campaigns</p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Create Your First Campaign
            </button>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Analytics</h3>
            <p className="text-gray-600">Comprehensive campaign performance insights coming soon...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Preview Modal */}
      <MessagePreviewModal
        guest={previewGuest}
        isOpen={!!previewGuest}
        onClose={() => setPreviewGuest(null)}
        templateId={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
      />
    </div>
  );
};

export default WhatsAppCampaignManager;