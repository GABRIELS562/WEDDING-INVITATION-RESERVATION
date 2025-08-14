/**
 * Production-Grade TypeScript Interfaces for Wedding RSVP System
 * Dale & Kirsten's Wedding - October 31st, 2025
 */

// Core guest and RSVP types
export interface Guest {
  id: string;
  guest_name: string;
  whatsapp_number?: string;
  unique_token: string;
  whatsapp_rsvp_link?: string;
  created_at: string;
}

export interface RSVP {
  id: string;
  timestamp: string;
  guest_token: string;
  guest_name: string;
  attending: boolean;
  meal_choice?: string;
  dietary_restrictions?: string;
  email_address?: string;
  email_confirmation_sent: boolean;
  submission_id: string;
  whatsapp_number?: string;
  whatsapp_confirmation: boolean;
}

// Form submission interfaces
export interface RSVPFormData {
  attending: boolean | null;
  meal_choice: string;
  dietary_restrictions: string;
  email_address: string;
}

export interface RSVPSubmissionPayload {
  guest_token: string;
  guest_name: string;
  attending: boolean;
  meal_choice?: string;
  dietary_restrictions?: string;
  email_address?: string;
  whatsapp_number?: string;
  wants_email_confirmation: boolean;
  wants_whatsapp_confirmation: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface SupabaseResponse<T = any> {
  data: T | null;
  error: {
    message: string;
    details: string;
    hint: string;
    code: string;
  } | null;
}

// Form validation and state management
export interface FormValidationErrors {
  attending?: string;
  meal_choice?: string;
  dietary_restrictions?: string;
  email_address?: string;
  guest_token?: string;
  general?: string;
}

export interface FormState {
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: string;
  submissionId?: string;
}

export interface TokenValidationState {
  isValidating: boolean;
  isValid: boolean;
  guest?: Guest;
  error?: string;
}

// Meal choice options
export const MEAL_CHOICES = [
  { value: 'chicken', label: 'Herb-Crusted Chicken', description: 'Free-range chicken breast with seasonal herbs' },
  { value: 'beef', label: 'Beef Tenderloin', description: 'Premium beef tenderloin with red wine jus' },
  { value: 'vegetarian', label: 'Vegetarian Delight', description: 'Roasted vegetable wellington with quinoa' },
  { value: 'vegan', label: 'Vegan Garden Bowl', description: 'Plant-based seasonal vegetables and grains' },
  { value: 'kids', label: 'Kids Meal', description: 'Child-friendly chicken nuggets with vegetables' }
] as const;

export type MealChoiceValue = typeof MEAL_CHOICES[number]['value'];

// Analytics and statistics
export interface RSVPStatistics {
  total_guests: number;
  total_rsvps: number;
  attending_count: number;
  not_attending_count: number;
  pending_rsvps: number;
  email_confirmations_sent: number;
  whatsapp_confirmations_sent: number;
  meal_choices: Record<string, number>;
  dietary_restrictions_count: number;
  last_updated: string;
}

// Rate limiting and security
export interface RateLimitInfo {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
  isLocked: boolean;
}

export interface SecurityContext {
  ipAddress: string;
  userAgent: string;
  timestamp: number;
  attempts: number;
}

// Component prop types
export interface RSVPFormProps {
  token: string;
  initialData?: RSVP;
  onSuccess?: (submissionId: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export interface TokenGuardProps {
  token: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export interface LoadingSkeletonProps {
  variant?: 'form' | 'card' | 'text' | 'button';
  className?: string;
  animate?: boolean;
}

// SEO and metadata
export interface RSVPPageMetadata {
  title: string;
  description: string;
  guestName?: string;
  canonical: string;
  ogImage?: string;
}

// Error types for better error handling
export enum RSVPErrorCode {
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  DUPLICATE_SUBMISSION = 'DUPLICATE_SUBMISSION',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class RSVPError extends Error {
  constructor(
    public code: RSVPErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'RSVPError';
  }
}

// Accessibility and UX
export interface A11yProps {
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
  tabIndex?: number;
}

export interface FormFieldProps extends A11yProps {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  disabled?: boolean;
}

// Animation and transition states
export interface AnimationState {
  isAnimating: boolean;
  direction: 'in' | 'out';
  duration: number;
}

export interface TransitionProps {
  show: boolean;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
  children: React.ReactNode;
}

// Performance monitoring
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  submissionTime: number;
  errorCount: number;
  userAgent: string;
  timestamp: number;
}

// Configuration and environment
export interface RSVPConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  weddingDate: string;
  venueLocation: string;
  coupleNames: string;
  rsvpDeadline: string;
  supportEmail: string;
  maxDietaryRestrictionsLength: number;
  rateLimitWindow: number;
  rateLimitMaxAttempts: number;
}

// Utility types for better type safety
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event handlers
export type FormEventHandler<T = HTMLFormElement> = (event: React.FormEvent<T>) => void;
export type ChangeEventHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
export type ClickEventHandler<T = HTMLButtonElement> = (event: React.MouseEvent<T>) => void;

// Reusable utility interfaces
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface LoadingProps extends BaseComponentProps {
  isLoading: boolean;
  loadingText?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
}

export interface ErrorProps extends BaseComponentProps {
  error: string | Error;
  retry?: () => void;
  showDetails?: boolean;
}

// Form field specific types
export interface RadioGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  group?: string;
}

// Success state configuration
export interface SuccessConfig {
  title: string;
  message: string;
  showConfetti?: boolean;
  redirectUrl?: string;
  redirectDelay?: number;
  showSocialShare?: boolean;
}

// Theme and styling
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  error: string;
  success: string;
  warning: string;
}

export interface WeddingTheme {
  colors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

// Export all types for easy importing
export type {
  Guest,
  RSVP,
  RSVPFormData,
  RSVPSubmissionPayload,
  ApiResponse,
  SupabaseResponse,
  FormValidationErrors,
  FormState,
  TokenValidationState,
  RSVPStatistics,
  RateLimitInfo,
  SecurityContext,
  RSVPFormProps,
  TokenGuardProps,
  LoadingSkeletonProps,
  RSVPPageMetadata,
  A11yProps,
  FormFieldProps,
  AnimationState,
  TransitionProps,
  PerformanceMetrics,
  RSVPConfig,
  RadioGroupOption,
  SelectOption,
  SuccessConfig,
  WeddingTheme
};