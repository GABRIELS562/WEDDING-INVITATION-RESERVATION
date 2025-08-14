/**
 * Admin Login Component
 * Dale & Kirsten's Wedding Admin Dashboard
 * 
 * Secure login interface with elegant wedding theme
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import adminAuth from '@/lib/adminAuth';

interface AdminLoginProps {
  onSuccess?: () => void;
  className?: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, className }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockoutTime, setLockoutTime] = useState(0);

  // Check for existing lockout
  useEffect(() => {
    const checkLockout = () => {
      const stored = localStorage.getItem('wedding-admin-lockout');
      if (stored) {
        const lockoutUntil = parseInt(stored);
        const remaining = lockoutUntil - Date.now();
        if (remaining > 0) {
          setLockoutTime(remaining);
          const timer = setInterval(() => {
            const newRemaining = lockoutUntil - Date.now();
            if (newRemaining <= 0) {
              setLockoutTime(0);
              clearInterval(timer);
            } else {
              setLockoutTime(newRemaining);
            }
          }, 1000);
          return () => clearInterval(timer);
        }
      }
    };

    checkLockout();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutTime > 0) return;
    if (!password.trim()) {
      setError('Please enter the admin password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await adminAuth.login(password);
      
      if (result.success) {
        setPassword('');
        onSuccess?.();
      } else {
        setError(result.error || 'Login failed');
        setPassword('');
        
        // Shake animation on error
        const form = e.target as HTMLFormElement;
        form.classList.add('error-shake');
        setTimeout(() => form.classList.remove('error-shake'), 500);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLockoutTime = (ms: number): string => {
    const minutes = Math.ceil(ms / 1000 / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center px-4 py-8',
      'bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100',
      className
    )}>
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShieldCheckIcon className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-rose-900 mb-2">
            Wedding Admin
          </h1>
          <p className="text-rose-700">
            Dale & Kirsten's RSVP Dashboard
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-rose-600">
            <HeartIcon className="w-4 h-4" />
            <span className="text-sm">October 31st, 2025</span>
            <HeartIcon className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100 p-8 space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Lockout Warning */}
          <AnimatePresence>
            {lockoutTime > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900">
                      Account Temporarily Locked
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Too many failed attempts. Please wait {formatLockoutTime(lockoutTime)} before trying again.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
                role="alert"
              >
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-900">
                      Login Failed
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-rose-900"
            >
              Admin Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || lockoutTime > 0}
                placeholder="Enter admin password"
                className={cn(
                  'w-full px-4 py-3 pr-12 rounded-xl border-2 bg-white transition-colors duration-200',
                  'focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none',
                  error
                    ? 'border-red-300 bg-red-50'
                    : 'border-rose-200 hover:border-rose-300',
                  (isLoading || lockoutTime > 0) && 'opacity-50 cursor-not-allowed'
                )}
                autoComplete="current-password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || lockoutTime > 0}
                className={cn(
                  'absolute right-3 top-1/2 transform -translate-y-1/2',
                  'text-rose-500 hover:text-rose-600 transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 rounded',
                  (isLoading || lockoutTime > 0) && 'opacity-50 cursor-not-allowed'
                )}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading || lockoutTime > 0 || !password.trim()}
            className={cn(
              'w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200',
              'focus:outline-none focus:ring-4 focus:ring-rose-500/50',
              isLoading || lockoutTime > 0 || !password.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 shadow-lg hover:shadow-xl'
            )}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : lockoutTime > 0 ? (
              `Locked for ${formatLockoutTime(lockoutTime)}`
            ) : (
              'Sign In to Dashboard'
            )}
          </motion.button>

          {/* Help Text */}
          <div className="text-center space-y-3 pt-4 border-t border-rose-200">
            <p className="text-sm text-rose-700">
              Secure access to wedding RSVP management
            </p>
            <div className="text-xs text-rose-600 space-y-1">
              <p>• View real-time RSVP responses</p>
              <p>• Manage guest list and invitations</p>
              <p>• Export data for wedding planning</p>
            </div>
          </div>
        </motion.form>

        {/* Footer */}
        <motion.div
          className="text-center mt-8 text-sm text-rose-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p>© 2025 Dale & Kirsten Wedding</p>
          <p className="text-xs mt-1">
            Protected by secure authentication
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;