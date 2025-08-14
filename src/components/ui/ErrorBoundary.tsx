/**
 * Production-Grade Error Boundary Components
 * Dale & Kirsten's Wedding RSVP System
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
// Removed Heroicons to fix React compatibility issue
import { cn } from '@/lib/utils';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolate?: boolean;
  className?: string;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  errorId: string;
  className?: string;
}

/**
 * Generate unique error ID for tracking
 */
function generateErrorId(): string {
  return `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Log error to monitoring service (placeholder for production)
 */
function logErrorToService(error: Error, errorInfo: React.ErrorInfo, errorId: string) {
  // In production, integrate with services like Sentry, LogRocket, etc.
  console.group(`🚨 Error Boundary Caught Error [${errorId}]`);
  console.error('Error:', error);
  console.error('Error Info:', errorInfo);
  console.error('Stack:', error.stack);
  console.error('Component Stack:', errorInfo.componentStack);
  console.groupEnd();

  // Track error analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error.toString(),
      fatal: false,
      custom_map: {
        error_id: errorId,
        error_boundary: true
      }
    });
  }
}

/**
 * Default error fallback component with wedding theme
 */
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  errorId,
  className
}) => {
  const isNetworkError = error.message.toLowerCase().includes('network') ||
                        error.message.toLowerCase().includes('fetch') ||
                        error.message.toLowerCase().includes('connection');

  const isValidationError = error.message.toLowerCase().includes('validation') ||
                           error.message.toLowerCase().includes('invalid');

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center space-y-6',
        'bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200',
        'min-h-[400px] max-w-md mx-auto',
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      role="alert"
      aria-live="assertive"
    >
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
      >
        <div className="w-16 h-16 text-6xl">⚠️</div>
      </motion.div>

      {/* Error Title */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-rose-900">
          Oops! Something went wrong
        </h2>
        <p className="text-rose-700 max-w-sm">
          {isNetworkError
            ? "We're having trouble connecting. Please check your internet connection and try again."
            : isValidationError
            ? "There was an issue with your information. Please review and try again."
            : "We encountered an unexpected error while processing your RSVP. Don't worry, your information is safe."
          }
        </p>
      </div>

      {/* Error Details (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <motion.details
          className="w-full mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <summary className="cursor-pointer text-sm text-rose-600 hover:text-rose-800 mb-2">
            Technical Details (Dev Mode)
          </summary>
          <div className="text-xs text-left bg-rose-100 p-3 rounded-lg font-mono">
            <p><strong>Error ID:</strong> {errorId}</p>
            <p><strong>Message:</strong> {error.message}</p>
            <p><strong>Stack:</strong></p>
            <pre className="whitespace-pre-wrap text-xs mt-1 max-h-32 overflow-auto">
              {error.stack}
            </pre>
          </div>
        </motion.details>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <motion.button
          onClick={resetError}
          className={cn(
            'flex-1 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl',
            'font-semibold transition-colors duration-200',
            'focus:outline-none focus:ring-4 focus:ring-rose-500/50'
          )}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          🔄 Try Again
        </motion.button>

        <motion.button
          onClick={() => window.location.reload()}
          className={cn(
            'flex-1 px-4 py-3 bg-white hover:bg-rose-50 text-rose-700 rounded-xl border border-rose-200',
            'font-medium transition-colors duration-200',
            'focus:outline-none focus:ring-4 focus:ring-rose-500/50'
          )}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Refresh Page
        </motion.button>
      </div>

      {/* Support Information */}
      <motion.div
        className="text-center space-y-2 border-t border-rose-200 pt-6 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-rose-600">
          Still having trouble? Contact us directly:
        </p>
        <div className="space-y-1 text-sm">
          <p className="text-rose-700">
            📧 <a 
              href="mailto:kirstendale583@gmail.com?subject=RSVP%20Technical%20Issue" 
              className="underline hover:text-rose-900"
            >
              kirstendale583@gmail.com
            </a>
          </p>
          <p className="text-rose-700">
            💬 WhatsApp us for immediate help
          </p>
        </div>
      </motion.div>

      {/* Wedding Branding */}
      <motion.div
        className="flex items-center gap-2 text-rose-800 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        ❤️
        <span>Dale & Kirsten's Wedding</span>
        ❤️
      </motion.div>
    </motion.div>
  );
};

/**
 * Network Error Fallback for specific network issues
 */
const NetworkErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  className
}) => (
  <motion.div
    className={cn(
      'flex flex-col items-center justify-center p-8 text-center space-y-6',
      'bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200',
      'min-h-[300px] max-w-md mx-auto',
      className
    )}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-6xl">🌐</div>
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-blue-900">Connection Issue</h3>
      <p className="text-blue-700">
        We're having trouble connecting to our servers. Please check your internet connection and try again.
      </p>
    </div>
    <button
      onClick={resetError}
      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
    >
      Retry Connection
    </button>
  </motion.div>
);

/**
 * Validation Error Fallback for form validation issues
 */
const ValidationErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  className
}) => (
  <motion.div
    className={cn(
      'flex flex-col items-center justify-center p-6 text-center space-y-4',
      'bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200',
      'max-w-md mx-auto',
      className
    )}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-4xl">⚠️</div>
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-yellow-900">Validation Error</h3>
      <p className="text-yellow-700 text-sm">
        There was an issue with your form data. Please review your information and try again.
      </p>
    </div>
    <button
      onClick={resetError}
      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
    >
      Go Back
    </button>
  </motion.div>
);

/**
 * Main Error Boundary Component
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorId: generateErrorId()
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError } = this.props;
    
    // Update state with error info
    this.setState({ errorInfo });

    // Log error
    logErrorToService(error, errorInfo, this.state.errorId);

    // Call custom error handler
    onError?.(error, errorInfo);

    // Auto-reset after 30 seconds in production (give user time to report)
    if (process.env.NODE_ENV === 'production') {
      this.resetTimeoutId = window.setTimeout(() => {
        this.resetError();
      }, 30000);
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetError = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }
    
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: ''
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback: CustomFallback, className } = this.props;
      const { error, errorId } = this.state;

      // Use custom fallback if provided
      if (CustomFallback) {
        return <CustomFallback error={error} resetError={this.resetError} errorId={errorId} className={className} />;
      }

      // Choose appropriate fallback based on error type
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return <NetworkErrorFallback error={error} resetError={this.resetError} errorId={errorId} className={className} />;
      }
      
      if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
        return <ValidationErrorFallback error={error} resetError={this.resetError} errorId={errorId} className={className} />;
      }

      // Default fallback
      return <DefaultErrorFallback error={error} resetError={this.resetError} errorId={errorId} className={className} />;
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Hook for imperatively triggering error boundary
 */
export function useErrorHandler() {
  return (error: Error, errorInfo?: string) => {
    console.error('Handled Error:', error);
    if (errorInfo) {
      console.error('Error Info:', errorInfo);
    }
    throw error;
  };
}

/**
 * Async error boundary for handling promise rejections
 */
export function handleAsyncError(error: unknown): never {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  throw errorObj;
}

export default ErrorBoundary;
export type { ErrorBoundaryProps, ErrorFallbackProps };
export { DefaultErrorFallback, NetworkErrorFallback, ValidationErrorFallback };