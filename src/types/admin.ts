/**
 * Admin Dashboard Types for Dale & Kirsten's Wedding
 * Comprehensive type definitions for admin functionality
 */

export interface AdminSession {
  isAuthenticated: boolean;
  loginTime: number;
  lastActivity: number;
  expiresAt: number;
}

export interface AdminAuthState {
  session: AdminSession | null;
  isLoading: boolean;
  error?: string;
}

export interface WeddingStatistics {
  totalGuests: number;
  totalResponses: number;
  attendingCount: number;
  notAttendingCount: number;
  pendingCount: number;
  responseRate: number;
  emailConfirmationsSent: number;
  mealChoiceBreakdown: MealChoiceStats;
  responseTimeline: ResponseTimelineData[];
  lastUpdated: string;
}

export interface MealChoiceStats {
  [key: string]: {
    count: number;
    percentage: number;
  };
}

export interface ResponseTimelineData {
  date: string;
  responses: number;
  cumulative: number;
}

export interface GuestListItem {
  id: string;
  guest_name: string;
  email_address?: string;
  whatsapp_number?: string;
  guest_token: string;
  attending?: boolean;
  meal_choice?: string;
  dietary_restrictions?: string;
  email_confirmation_sent: boolean;
  submitted_at?: string;
  updated_at?: string;
  rsvp_status: 'pending' | 'attending' | 'not_attending';
  has_plus_one: boolean;
  is_child: boolean;
  invitation_sent: boolean;
  whatsapp_link?: string;
}

export interface GuestFilters {
  search: string;
  rsvpStatus: 'all' | 'pending' | 'attending' | 'not_attending';
  mealChoice: string;
  emailConfirmation: 'all' | 'sent' | 'not_sent';
  invitationSent: 'all' | 'sent' | 'not_sent';
  sortBy: 'name' | 'submitted_at' | 'updated_at';
  sortOrder: 'asc' | 'desc';
}

export interface AdminDashboardProps {
  className?: string;
}

export interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: 'rose' | 'green' | 'blue' | 'yellow' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeEmails: boolean;
  includeWhatsApp: boolean;
  includeDietary: boolean;
  filterBy: GuestFilters;
}

export interface ExportData {
  filename: string;
  data: any[];
  mimeType: string;
}

export interface ManualRSVPEntry {
  guest_token: string;
  attending: boolean;
  meal_choice?: string;
  dietary_restrictions?: string;
  email_address?: string;
  notes?: string;
  submitted_by_admin: boolean;
}

export interface WhatsAppInvitation {
  guest_name: string;
  phone_number: string;
  invitation_url: string;
  message_template: string;
  whatsapp_url: string;
}

export interface AdminNotification {
  id: string;
  type: 'new_rsvp' | 'updated_rsvp' | 'system' | 'error';
  title: string;
  message: string;
  guest_name?: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export interface RealTimeSubscription {
  channel: string;
  isConnected: boolean;
  lastUpdate: string;
  error?: string;
}

export interface AdminSettings {
  notifications: {
    sound: boolean;
    desktop: boolean;
    newRSVP: boolean;
    updates: boolean;
  };
  dashboard: {
    refreshInterval: number;
    defaultView: 'overview' | 'guests' | 'reports';
    itemsPerPage: number;
  };
  export: {
    defaultFormat: 'csv' | 'excel' | 'pdf';
    includePersonalData: boolean;
  };
}

export interface AdminAnalytics {
  dailyResponses: { date: string; count: number }[];
  hourlyActivity: { hour: number; responses: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  geographicData: { country: string; count: number }[];
  conversionFunnel: {
    invitationsSent: number;
    linksClicked: number;
    formsStarted: number;
    formsCompleted: number;
  };
}

export interface BulkAction {
  type: 'send_reminder' | 'mark_invited' | 'export_selection' | 'delete_selection';
  guestIds: string[];
  options?: Record<string, any>;
}

export interface AdminError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  resolved: boolean;
}

// Component Props
export interface GuestTableProps {
  guests: GuestListItem[];
  filters: GuestFilters;
  onFiltersChange: (filters: Partial<GuestFilters>) => void;
  onGuestSelect: (guestId: string) => void;
  onBulkAction: (action: BulkAction) => void;
  selectedGuests: string[];
  isLoading: boolean;
  className?: string;
}

export interface GuestDetailModalProps {
  guest: GuestListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (guestId: string, updates: Partial<GuestListItem>) => Promise<void>;
  onSendReminder: (guestId: string) => Promise<void>;
  className?: string;
}

export interface StatsOverviewProps {
  statistics: WeddingStatistics;
  isLoading: boolean;
  className?: string;
}

export interface AdminNavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  notifications: AdminNotification[];
  onLogout: () => void;
  className?: string;
}

export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredPermissions?: string[];
  className?: string;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

// API Response Types
export interface AdminApiResponse<T = any> {
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

export interface AdminDashboardData {
  statistics: WeddingStatistics;
  recentActivity: AdminNotification[];
  guestSummary: {
    total: number;
    pending: number;
    attending: number;
    notAttending: number;
  };
  systemHealth: {
    database: boolean;
    email: boolean;
    realtime: boolean;
    lastCheck: string;
  };
}

// Chart Configuration Types
export interface ChartConfig {
  type: 'doughnut' | 'bar' | 'line' | 'pie';
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
      position: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip: {
      enabled: boolean;
      callbacks?: Record<string, (context: any) => string>;
    };
  };
  scales?: {
    x?: {
      display: boolean;
      grid: { display: boolean };
    };
    y?: {
      display: boolean;
      grid: { display: boolean };
      beginAtZero: boolean;
    };
  };
}

// Constants
export const ADMIN_CONFIG = {
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours
  ACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  REFRESH_INTERVAL: 30 * 1000, // 30 seconds
  PASSWORD: 'dalekirsten2025',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

export const MEAL_CHOICES = [
  { value: 'beef', label: 'Beef Wellington', description: 'Tender beef with mushroom duxelles' },
  { value: 'chicken', label: 'Herb-Crusted Chicken', description: 'Free-range chicken breast with herbs' },
  { value: 'fish', label: 'Pan-Seared Salmon', description: 'Atlantic salmon with lemon butter' },
  { value: 'vegetarian', label: 'Vegetarian Risotto', description: 'Creamy mushroom and herb risotto' },
  { value: 'vegan', label: 'Vegan Garden Bowl', description: 'Seasonal vegetables with quinoa' },
  { value: 'child', label: 'Children\'s Meal', description: 'Chicken tenders with vegetables' },
] as const;

export const GUEST_STATUS_COLORS = {
  pending: 'yellow',
  attending: 'green',
  not_attending: 'red',
} as const;

export const NOTIFICATION_TYPES = {
  new_rsvp: { icon: '🎉', color: 'green' },
  updated_rsvp: { icon: '✏️', color: 'blue' },
  system: { icon: 'ℹ️', color: 'gray' },
  error: { icon: '⚠️', color: 'red' },
} as const;

// Utility Types
export type AdminViewType = 'overview' | 'guests' | 'analytics' | 'reports' | 'settings';
export type SortDirection = 'asc' | 'desc';
export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'in';

// Export all types
export type {
  AdminSession,
  AdminAuthState,
  WeddingStatistics,
  GuestListItem,
  GuestFilters,
  AdminDashboardProps,
  StatisticsCardProps,
  ChartData,
  ExportOptions,
  ManualRSVPEntry,
  WhatsAppInvitation,
  AdminNotification,
  RealTimeSubscription,
  AdminSettings,
  AdminAnalytics,
  BulkAction,
  AdminError,
  AdminApiResponse,
  AdminDashboardData,
  ChartConfig,
};