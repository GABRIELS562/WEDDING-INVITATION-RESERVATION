/**
 * WhatsApp Campaign Management Types
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Comprehensive types for WhatsApp link generation and campaign management
 */

export interface WhatsAppGuest {
  id: string;
  guest_name: string;
  phone_number: string;
  guest_token: string;
  backup_token?: string;
  rsvp_url: string;
  whatsapp_link: string;
  message_preview: string;
  has_plus_one: boolean;
  is_child: boolean;
  created_at: string;
  updated_at: string;
  
  // Campaign tracking
  invitation_sent: boolean;
  invitation_sent_at?: string;
  last_reminder_sent?: string;
  reminder_count: number;
  link_clicked: boolean;
  link_clicked_at?: string;
  click_count: number;
  rsvp_completed: boolean;
  rsvp_completed_at?: string;
  
  // Status tracking
  phone_valid: boolean;
  token_expired: boolean;
  campaign_status: 'pending' | 'sent' | 'delivered' | 'clicked' | 'responded' | 'bounced';
  
  // Metadata
  notes?: string;
  tags: string[];
  priority: 'high' | 'normal' | 'low';
}

export interface WhatsAppCampaign {
  id: string;
  name: string;
  description: string;
  message_template: string;
  created_at: string;
  created_by: string;
  
  // Campaign settings
  send_immediately: boolean;
  scheduled_send_time?: string;
  reminder_enabled: boolean;
  reminder_delay_days: number;
  max_reminders: number;
  
  // Targeting
  include_children: boolean;
  include_plus_ones: boolean;
  target_tags: string[];
  exclude_tags: string[];
  
  // Campaign status
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'completed' | 'cancelled';
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  clicked_count: number;
  responded_count: number;
  error_count: number;
  
  // Timing
  send_started_at?: string;
  send_completed_at?: string;
  estimated_completion?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  template_text: string;
  variables: string[];
  category: 'invitation' | 'reminder' | 'thank_you' | 'update' | 'custom';
  is_default: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface MessageTemplate {
  greeting: string;
  main_message: string;
  rsvp_instruction: string;
  deadline_reminder: string;
  closing: string;
  signature: string;
  emojis: {
    heart: string;
    ring: string;
    celebration: string;
    calendar: string;
  };
}

export interface TokenGenerationOptions {
  length: number;
  use_crypto_random: boolean;
  include_checksum: boolean;
  expiry_days: number;
  generate_backup: boolean;
  prefix?: string;
  exclude_similar_chars: boolean;
}

export interface BulkTokenGeneration {
  guest_count: number;
  tokens_generated: number;
  backup_tokens_generated: number;
  success_count: number;
  error_count: number;
  errors: string[];
  generation_time_ms: number;
  batch_id: string;
}

export interface WhatsAppLink {
  guest_id: string;
  guest_name: string;
  phone_number: string;
  clean_phone: string;
  whatsapp_url: string;
  rsvp_url: string;
  message_text: string;
  encoded_message: string;
  link_valid: boolean;
  created_at: string;
  expires_at: string;
  click_tracking_enabled: boolean;
  utm_parameters: {
    source: string;
    medium: string;
    campaign: string;
    content: string;
  };
}

export interface WhatsAppAnalytics {
  campaign_id?: string;
  total_links_generated: number;
  total_messages_sent: number;
  total_clicks: number;
  total_responses: number;
  
  // Performance metrics
  click_through_rate: number;
  response_rate: number;
  bounce_rate: number;
  average_response_time_hours: number;
  
  // Time-based analytics
  daily_stats: Array<{
    date: string;
    messages_sent: number;
    clicks: number;
    responses: number;
  }>;
  
  hourly_activity: Array<{
    hour: number;
    activity_count: number;
  }>;
  
  // Geographic data
  country_breakdown: Array<{
    country: string;
    guest_count: number;
    response_rate: number;
  }>;
  
  // Device/platform data
  platform_breakdown: Array<{
    platform: 'whatsapp_web' | 'whatsapp_mobile' | 'unknown';
    count: number;
    percentage: number;
  }>;
}

export interface GuestImportData {
  guest_name: string;
  phone_number: string;
  email_address?: string;
  has_plus_one?: boolean;
  is_child?: boolean;
  notes?: string;
  tags?: string[];
  priority?: 'high' | 'normal' | 'low';
}

export interface GuestImportResult {
  total_processed: number;
  successful_imports: number;
  failed_imports: number;
  duplicate_count: number;
  validation_errors: Array<{
    row: number;
    guest_name: string;
    errors: string[];
  }>;
  imported_guests: WhatsAppGuest[];
  batch_id: string;
}

export interface WhatsAppValidation {
  phone_number: string;
  is_valid: boolean;
  formatted_number: string;
  country_code: string;
  country_name: string;
  carrier?: string;
  line_type?: 'mobile' | 'landline' | 'voip' | 'unknown';
  validation_errors: string[];
}

export interface CampaignSchedule {
  campaign_id: string;
  send_time: string;
  timezone: string;
  batch_size: number;
  batch_delay_seconds: number;
  retry_failed: boolean;
  max_retry_attempts: number;
}

export interface WhatsAppBatchJob {
  id: string;
  campaign_id: string;
  batch_number: number;
  total_batches: number;
  guest_ids: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  started_at?: string;
  completed_at?: string;
  success_count: number;
  error_count: number;
  errors: string[];
}

export interface WhatsAppConfig {
  base_url: string;
  api_version: string;
  rate_limits: {
    messages_per_minute: number;
    messages_per_hour: number;
    messages_per_day: number;
  };
  retry_config: {
    max_attempts: number;
    initial_delay_ms: number;
    max_delay_ms: number;
    backoff_multiplier: number;
  };
  validation: {
    min_phone_length: number;
    max_phone_length: number;
    allowed_country_codes: string[];
    blocked_prefixes: string[];
  };
}

export interface LinkClickEvent {
  id: string;
  guest_token: string;
  guest_id: string;
  clicked_at: string;
  ip_address: string;
  user_agent: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  session_id: string;
  is_unique_click: boolean;
}

export interface WhatsAppError {
  code: string;
  message: string;
  guest_id?: string;
  phone_number?: string;
  retry_after?: number;
  is_permanent: boolean;
  timestamp: string;
}

// Component Props Types
export interface WhatsAppCampaignManagerProps {
  className?: string;
}

export interface GuestImportWizardProps {
  onImportComplete: (result: GuestImportResult) => void;
  onCancel: () => void;
  className?: string;
}

export interface WhatsAppLinkGeneratorProps {
  guests: WhatsAppGuest[];
  onLinksGenerated: (links: WhatsAppLink[]) => void;
  className?: string;
}

export interface CampaignAnalyticsProps {
  campaignId?: string;
  analytics: WhatsAppAnalytics;
  isLoading: boolean;
  className?: string;
}

export interface MessageTemplateEditorProps {
  template: MessageTemplate;
  onTemplateChange: (template: MessageTemplate) => void;
  guestPreview?: WhatsAppGuest;
  className?: string;
}

export interface WhatsAppLinkTableProps {
  guests: WhatsAppGuest[];
  selectedGuests: string[];
  onGuestSelect: (guestId: string) => void;
  onSelectAll: () => void;
  onBulkAction: (action: string, guestIds: string[]) => void;
  onCopyLink: (guest: WhatsAppGuest) => void;
  onSendMessage: (guest: WhatsAppGuest) => void;
  className?: string;
}

export interface TokenSecurityProps {
  tokenLength: number;
  expiryDays: number;
  onSecurityChange: (options: TokenGenerationOptions) => void;
  className?: string;
}

// API Response Types
export interface WhatsAppApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Constants
export const WHATSAPP_CONFIG = {
  DEFAULT_TOKEN_LENGTH: 12,
  MAX_TOKEN_LENGTH: 32,
  MIN_TOKEN_LENGTH: 8,
  DEFAULT_EXPIRY_DAYS: 60,
  MAX_EXPIRY_DAYS: 365,
  DEFAULT_REMINDER_DELAY: 7,
  MAX_REMINDERS: 3,
  BATCH_SIZE: 50,
  RATE_LIMIT_PER_MINUTE: 30,
  RATE_LIMIT_PER_HOUR: 1000,
} as const;

export const MESSAGE_VARIABLES = [
  'guest_name',
  'rsvp_link',
  'rsvp_deadline',
  'wedding_date',
  'wedding_venue',
  'couple_names',
  'contact_email',
  'custom_message'
] as const;

export const CAMPAIGN_STATUSES = [
  'draft',
  'scheduled',
  'sending',
  'sent',
  'completed',
  'cancelled'
] as const;

export const GUEST_PRIORITIES = ['high', 'normal', 'low'] as const;

export const TEMPLATE_CATEGORIES = [
  'invitation',
  'reminder',
  'thank_you',
  'update',
  'custom'
] as const;

// Utility Types
export type WhatsAppEventType = 'link_generated' | 'message_sent' | 'link_clicked' | 'rsvp_completed' | 'error_occurred';
export type CampaignStatus = typeof CAMPAIGN_STATUSES[number];
export type GuestPriority = typeof GUEST_PRIORITIES[number];
export type TemplateCategory = typeof TEMPLATE_CATEGORIES[number];
export type MessageVariable = typeof MESSAGE_VARIABLES[number];

// Export all types
export type {
  WhatsAppGuest,
  WhatsAppCampaign,
  WhatsAppTemplate,
  MessageTemplate,
  TokenGenerationOptions,
  BulkTokenGeneration,
  WhatsAppLink,
  WhatsAppAnalytics,
  GuestImportData,
  GuestImportResult,
  WhatsAppValidation,
  CampaignSchedule,
  WhatsAppBatchJob,
  WhatsAppConfig,
  LinkClickEvent,
  WhatsAppError,
  WhatsAppApiResponse,
};