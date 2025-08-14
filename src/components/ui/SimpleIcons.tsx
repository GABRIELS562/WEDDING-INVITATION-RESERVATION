/**
 * Simple Icon Components - Replacement for Heroicons
 * Used to fix React compatibility issues
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5', 
  lg: 'w-6 h-6'
};

export const CheckCircleIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <span className={cn(iconSizes[size], 'inline-flex items-center justify-center text-green-500', className)}>
    ✅
  </span>
);

export const ExclamationTriangleIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <span className={cn(iconSizes[size], 'inline-flex items-center justify-center text-amber-500', className)}>
    ⚠️
  </span>
);

export const HeartIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <span className={cn(iconSizes[size], 'inline-flex items-center justify-center text-rose-500', className)}>
    ❤️
  </span>
);

export const CalendarIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <span className={cn(iconSizes[size], 'inline-flex items-center justify-center text-blue-500', className)}>
    📅
  </span>
);

export const MapPinIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <span className={cn(iconSizes[size], 'inline-flex items-center justify-center text-red-500', className)}>
    📍
  </span>
);

export const ArrowPathIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <span className={cn(iconSizes[size], 'inline-flex items-center justify-center', className)}>
    🔄
  </span>
);

export const XMarkIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <span className={cn(iconSizes[size], 'inline-flex items-center justify-center text-red-500', className)}>
    ❌
  </span>
);

export const PlusIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <span className={cn(iconSizes[size], 'inline-flex items-center justify-center text-green-500', className)}>
    ➕
  </span>
);

export const MinusIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <span className={cn(iconSizes[size], 'inline-flex items-center justify-center text-red-500', className)}>
    ➖
  </span>
);

export const InformationCircleIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <span className={cn(iconSizes[size], 'inline-flex items-center justify-center text-blue-500', className)}>
    ℹ️
  </span>
);

export const UserIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <span className={cn(iconSizes[size], 'inline-flex items-center justify-center text-gray-500', className)}>
    👤
  </span>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <span className={cn(iconSizes[size], 'inline-flex items-center justify-center text-green-500', className)}>
    🛡️
  </span>
);