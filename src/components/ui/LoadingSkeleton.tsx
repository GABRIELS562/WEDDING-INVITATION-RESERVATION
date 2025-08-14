/**
 * Production-Grade Loading Skeletons
 * Dale & Kirsten's Wedding RSVP System
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { LoadingSkeletonProps } from '@/types/rsvp';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, animate = true }) => (
  <div
    className={cn(
      'bg-gradient-to-r from-rose-100/60 via-rose-50/80 to-rose-100/60 rounded-lg',
      animate && 'animate-pulse',
      className
    )}
    role="status"
    aria-label="Loading content"
  />
);

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'form',
  className,
  animate = true
}) => {
  const baseClasses = 'space-y-4';

  switch (variant) {
    case 'form':
      return (
        <div className={cn(baseClasses, className)} role="status" aria-label="Loading form">
          {/* Header skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4 mx-auto" animate={animate} />
            <Skeleton className="h-4 w-full" animate={animate} />
            <Skeleton className="h-4 w-5/6 mx-auto" animate={animate} />
          </div>
          
          {/* Form fields skeleton */}
          <div className="space-y-6 mt-8">
            {/* Attending field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" animate={animate} />
              <div className="flex space-x-4">
                <Skeleton className="h-12 w-24 rounded-full" animate={animate} />
                <Skeleton className="h-12 w-24 rounded-full" animate={animate} />
              </div>
            </div>
            
            {/* Meal choice field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" animate={animate} />
              <Skeleton className="h-12 w-full rounded-lg" animate={animate} />
            </div>
            
            {/* Dietary restrictions field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" animate={animate} />
              <Skeleton className="h-24 w-full rounded-lg" animate={animate} />
            </div>
            
            {/* Email field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" animate={animate} />
              <Skeleton className="h-12 w-full rounded-lg" animate={animate} />
            </div>
            
            {/* Submit button */}
            <Skeleton className="h-14 w-full rounded-full mt-8" animate={animate} />
          </div>
        </div>
      );

    case 'card':
      return (
        <div className={cn('space-y-4 p-6 border border-rose-100 rounded-xl', className)} role="status">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" animate={animate} />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" animate={animate} />
              <Skeleton className="h-4 w-1/2" animate={animate} />
            </div>
          </div>
          <Skeleton className="h-32 w-full rounded-lg" animate={animate} />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20 rounded-md" animate={animate} />
            <Skeleton className="h-8 w-24 rounded-md" animate={animate} />
          </div>
        </div>
      );

    case 'text':
      return (
        <div className={cn('space-y-2', className)} role="status">
          <Skeleton className="h-4 w-full" animate={animate} />
          <Skeleton className="h-4 w-5/6" animate={animate} />
          <Skeleton className="h-4 w-4/6" animate={animate} />
        </div>
      );

    case 'button':
      return (
        <Skeleton 
          className={cn('h-12 w-32 rounded-full', className)} 
          animate={animate}
          role="status"
          aria-label="Loading button"
        />
      );

    default:
      return (
        <div className={cn(baseClasses, className)} role="status">
          <Skeleton className="h-4 w-full" animate={animate} />
          <Skeleton className="h-4 w-5/6" animate={animate} />
          <Skeleton className="h-4 w-4/6" animate={animate} />
        </div>
      );
  }
};

// Specialized loading components for common patterns
export const FormLoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="form" className={className} />
);

export const CardLoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="card" className={className} />
);

export const TextLoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="text" className={className} />
);

export const ButtonLoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="button" className={className} />
);

// Loading spinner for immediate feedback
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'rose' | 'gold' | 'white';
}> = ({ 
  size = 'md', 
  className,
  color = 'rose'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    rose: 'text-rose-500',
    gold: 'text-amber-500',
    white: 'text-white'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Full page loading overlay
export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  message?: string;
  className?: string;
}> = ({ 
  isVisible, 
  message = 'Loading...', 
  className 
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center',
        className
      )}
      role="status"
      aria-label={message}
    >
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" color="rose" />
        <p className="text-rose-800 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSkeleton;