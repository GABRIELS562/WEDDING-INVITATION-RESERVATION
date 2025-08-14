/**
 * Token Guard Component with Elegant Error Handling
 * Dale & Kirsten's Wedding RSVP System
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TokenGuardProps, TokenValidationState, Guest } from '@/types/rsvp';
import { validateGuestToken } from '@/lib/supabase';
import { FormLoadingSkeleton, LoadingSpinner } from './ui/LoadingSkeleton';
import { ExclamationTriangleIcon, HeartIcon, UserIcon, ShieldCheckIcon } from './ui/SimpleIcons';

interface TokenErrorProps {
  error: string;
  onRetry: () => void;
  className?: string;
}

const TokenError: React.FC<TokenErrorProps> = ({ error, onRetry, className }) => {
  const isInvalidFormat = error.toLowerCase().includes('invalid token format');
  const isNotFound = error.toLowerCase().includes('not found');
  const isRateLimit = error.toLowerCase().includes('rate limit') || error.toLowerCase().includes('too many');

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6',
        'bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200',
        'max-w-lg mx-auto',
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      role="alert"
      aria-live="assertive"
    >
      {/* Icon based on error type */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
      >
        {isRateLimit ? (
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <span className="text-2xl">⏱️</span>
          </div>
        ) : isNotFound ? (
          <ExclamationTriangleIcon className="w-16 h-16 text-rose-500" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-rose-500" />
          </div>
        )}
      </motion.div>

      {/* Error Title and Message */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-rose-900">
          {isRateLimit 
            ? 'Please Wait a Moment'
            : isNotFound 
            ? 'Invitation Not Found'
            : 'Invalid Invitation Link'
          }
        </h1>
        
        <div className="space-y-2 text-rose-700">
          {isRateLimit ? (
            <p>
              We've received multiple requests. Please wait a few minutes before trying again.
            </p>
          ) : isNotFound ? (
            <>
              <p className="font-medium">
                We couldn't find an invitation matching this link.
              </p>
              <p className="text-sm">
                This could happen if:
              </p>
              <ul className="text-sm text-left max-w-sm mx-auto space-y-1 list-disc list-inside">
                <li>The invitation link was typed incorrectly</li>
                <li>The link is from an old or test invitation</li>
                <li>There was an issue with how the link was shared</li>
              </ul>
            </>
          ) : (
            <>
              <p className="font-medium">
                The invitation link appears to be incomplete or incorrect.
              </p>
              <p className="text-sm">
                Please check that you have the complete link from your invitation.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        {!isRateLimit && (
          <motion.button
            onClick={onRetry}
            className={cn(
              'flex-1 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl',
              'font-semibold transition-colors duration-200',
              'focus:outline-none focus:ring-4 focus:ring-rose-500/50'
            )}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Try Again
          </motion.button>
        )}

        <motion.button
          onClick={() => window.location.href = '/'}
          className={cn(
            'flex-1 px-4 py-3 bg-white hover:bg-rose-50 text-rose-700 rounded-xl border border-rose-200',
            'font-medium transition-colors duration-200',
            'focus:outline-none focus:ring-4 focus:ring-rose-500/50'
          )}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isRateLimit ? 0.3 : 0.4 }}
        >
          Go to Wedding Website
        </motion.button>
      </div>

      {/* Help Section */}
      <motion.div
        className="text-center space-y-3 border-t border-rose-200 pt-6 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-rose-800">Need Help?</h3>
        <div className="space-y-2 text-sm text-rose-700">
          <p>
            If you continue having trouble, please contact Dale & Kirsten directly:
          </p>
          <div className="space-y-1">
            <p>
              📧 <a 
                href="mailto:kirstendale583@gmail.com?subject=RSVP%20Link%20Issue" 
                className="font-medium underline hover:text-rose-900"
              >
                kirstendale583@gmail.com
              </a>
            </p>
            <p>
              💬 Send us a WhatsApp message
            </p>
          </div>
          <p className="text-xs text-rose-600 mt-3">
            Please include a screenshot of this error if possible
          </p>
        </div>
      </motion.div>

      {/* Wedding Branding */}
      <motion.div
        className="flex items-center gap-2 text-rose-800 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <HeartIcon className="w-4 h-4 text-rose-500" />
        <span>Dale & Kirsten • October 31st, 2025</span>
        <HeartIcon className="w-4 h-4 text-rose-500" />
      </motion.div>
    </motion.div>
  );
};

const TokenValidating: React.FC<{ className?: string }> = ({ className }) => (
  <motion.div
    className={cn(
      'flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-6',
      'bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200',
      'max-w-md mx-auto',
      className
    )}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <ShieldCheckIcon className="w-16 h-16 text-blue-500" />
    </motion.div>

    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-blue-900">
        Verifying Your Invitation
      </h2>
      <p className="text-blue-700">
        Please wait while we confirm your invitation details...
      </p>
    </div>

    <LoadingSpinner size="lg" color="rose" />

    <div className="flex items-center gap-2 text-blue-800 text-sm">
      <HeartIcon className="w-4 h-4 text-blue-500" />
      <span>Dale & Kirsten's Wedding</span>
      <HeartIcon className="w-4 h-4 text-blue-500" />
    </div>
  </motion.div>
);

const WelcomeMessage: React.FC<{ guest: Guest; className?: string }> = ({ guest, className }) => (
  <motion.div
    className={cn(
      'bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 mb-6',
      'text-center space-y-3',
      className
    )}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
    >
      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <UserIcon className="w-6 h-6 text-green-600" />
      </div>
    </motion.div>

    <div className="space-y-1">
      <h2 className="text-xl font-bold text-green-900">
        Welcome, {guest.guest_name}! 🎉
      </h2>
      <p className="text-green-700 text-sm">
        Your invitation has been verified. Please complete your RSVP below.
      </p>
    </div>
  </motion.div>
);

const TokenGuard: React.FC<TokenGuardProps> = ({
  token,
  children,
  fallback,
  className
}) => {
  const [validationState, setValidationState] = useState<TokenValidationState>({
    isValidating: true,
    isValid: false
  });

  const validateToken = async () => {
    setValidationState(prev => ({ ...prev, isValidating: true, error: undefined }));

    try {
      const result = await validateGuestToken(token);
      
      if (result.success && result.data) {
        setValidationState({
          isValidating: false,
          isValid: true,
          guest: result.data
        });
      } else {
        setValidationState({
          isValidating: false,
          isValid: false,
          error: result.error || 'Invalid invitation token'
        });
      }
    } catch (error) {
      setValidationState({
        isValidating: false,
        isValid: false,
        error: error instanceof Error ? error.message : 'Failed to validate invitation'
      });
    }
  };

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setValidationState({
        isValidating: false,
        isValid: false,
        error: 'No invitation token provided'
      });
    }
  }, [token]);

  // Show loading state
  if (validationState.isValidating) {
    return <TokenValidating className={className} />;
  }

  // Show error state
  if (!validationState.isValid || validationState.error) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <TokenError 
        error={validationState.error || 'Unknown error'} 
        onRetry={validateToken}
        className={className}
      />
    );
  }

  // Show success state with welcome message and children
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {validationState.guest && (
          <WelcomeMessage 
            key="welcome"
            guest={validationState.guest} 
          />
        )}
      </AnimatePresence>
      
      {/* Clone children and pass guest data if needed */}
      {React.isValidElement(children) 
        ? React.cloneElement(children, { 
            guestInfo: validationState.guest,
            ...children.props 
          })
        : children
      }
    </div>
  );
};

export default TokenGuard;
export { TokenError, TokenValidating, WelcomeMessage };
export type { TokenGuardProps };