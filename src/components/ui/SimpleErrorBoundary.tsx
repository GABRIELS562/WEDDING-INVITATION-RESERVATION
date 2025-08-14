/**
 * Simple Error Boundary - No Framer Motion
 * Dale & Kirsten's Wedding RSVP System
 */

'use client';

import React from 'react';
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
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'exception', {
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
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center space-y-6',
        'bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200',
        'min-h-[400px] max-w-md mx-auto',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Error Icon */}
      <div className="w-16 h-16 text-6xl">⚠️</div>

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
        <details className="w-full mt-4">
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
        </details>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={resetError}
          className={cn(
            'flex-1 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl',
            'font-semibold transition-colors duration-200',
            'focus:outline-none focus:ring-4 focus:ring-rose-500/50'
          )}
        >
          🔄 Try Again
        </button>

        <button
          onClick={() => window.location.reload()}
          className={cn(
            'flex-1 px-4 py-3 bg-white hover:bg-rose-50 text-rose-700 rounded-xl border border-rose-200',
            'font-medium transition-colors duration-200',
            'focus:outline-none focus:ring-4 focus:ring-rose-500/50'
          )}
        >
          Refresh Page
        </button>
      </div>

      {/* Support Information */}
      <div className="text-center space-y-2 border-t border-rose-200 pt-6 w-full">
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
      </div>

      {/* Wedding Branding */}
      <div className="flex items-center gap-2 text-rose-800 text-sm">
        ❤️
        <span>Dale & Kirsten's Wedding</span>
        ❤️
      </div>
    </div>
  );
};

/**
 * Main Error Boundary Component
 */
class SimpleErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
    <SimpleErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </SimpleErrorBoundary>
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

export default SimpleErrorBoundary;
export type { ErrorBoundaryProps, ErrorFallbackProps };
export { DefaultErrorFallback };