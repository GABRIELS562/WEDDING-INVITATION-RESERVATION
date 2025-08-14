/**
 * Admin Layout Component
 * Dale & Kirsten's Wedding Admin Dashboard
 * 
 * Main layout with navigation, session management, and responsive design
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import adminAuth from '@/lib/adminAuth';
import adminSupabase from '@/lib/adminSupabase';
import { AdminNotification, AdminViewType } from '@/types/admin';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: AdminViewType;
  onViewChange: (view: AdminViewType) => void;
  className?: string;
}

interface NavItemProps {
  icon: React.ComponentType<any>;
  label: string;
  view: AdminViewType;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
}

// Navigation Item Component
const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, view, isActive, onClick, badge }) => (
  <motion.button
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
      isActive
        ? 'bg-rose-500 text-white shadow-lg'
        : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
    )}
    whileHover={{ x: isActive ? 0 : 4 }}
    whileTap={{ scale: 0.98 }}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className={cn(
        'ml-auto px-2 py-1 text-xs font-bold rounded-full',
        isActive ? 'bg-white text-rose-500' : 'bg-rose-500 text-white'
      )}>
        {badge > 99 ? '99+' : badge}
      </span>
    )}
  </motion.button>
);

// Session Timer Component
const SessionTimer: React.FC = () => {
  const [timeRemaining, setTimeRemaining] = useState<{ minutes: number; seconds: number } | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = adminAuth.getTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining && remaining.minutes < 5) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeRemaining) return null;

  return (
    <div className={cn(
      'px-4 py-2 text-xs rounded-lg border',
      showWarning 
        ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
        : 'bg-gray-50 border-gray-200 text-gray-600'
    )}>
      <div className="flex items-center gap-2">
        <ShieldCheckIcon className="w-3 h-3" />
        <span>
          Session: {timeRemaining.minutes}m {timeRemaining.seconds}s
        </span>
      </div>
      {showWarning && (
        <div className="mt-1 text-xs">
          Session expires soon!
        </div>
      )}
    </div>
  );
};

// Notifications Panel
const NotificationsPanel: React.FC<{
  notifications: AdminNotification[];
  onClose: () => void;
}> = ({ notifications, onClose }) => (
  <motion.div
    initial={{ opacity: 0, x: 300 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 300 }}
    className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
  >
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-6 text-center">
          <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No new notifications</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'p-3 rounded-lg border-l-4',
                notification.type === 'new_rsvp' ? 'bg-green-50 border-green-500' :
                notification.type === 'updated_rsvp' ? 'bg-blue-50 border-blue-500' :
                notification.type === 'error' ? 'bg-red-50 border-red-500' :
                'bg-gray-50 border-gray-500'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="text-lg">
                  {notification.type === 'new_rsvp' ? '🎉' :
                   notification.type === 'updated_rsvp' ? '✏️' :
                   notification.type === 'error' ? '⚠️' : 'ℹ️'}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentView,
  onViewChange,
  className
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigationItems = [
    { icon: HomeIcon, label: 'Overview', view: 'overview' as AdminViewType },
    { icon: UsersIcon, label: 'Guests', view: 'guests' as AdminViewType },
    { icon: ChartBarIcon, label: 'Analytics', view: 'analytics' as AdminViewType },
    { icon: DocumentArrowDownIcon, label: 'Reports', view: 'reports' as AdminViewType },
    { icon: Cog6ToothIcon, label: 'Settings', view: 'settings' as AdminViewType },
  ];

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      const result = await adminSupabase.getRecentActivity(20);
      if (result.success && result.data) {
        setNotifications(result.data);
        setUnreadCount(result.data.filter(n => !n.read).length);
      }
    };

    loadNotifications();

    // Set up real-time notifications
    const unsubscribe = adminSupabase.subscribeToRSVPUpdates(
      (payload) => {
        // Add new notification
        const newNotification: AdminNotification = {
          id: `${Date.now()}-${Math.random()}`,
          type: payload.eventType === 'INSERT' ? 'new_rsvp' : 'updated_rsvp',
          title: payload.eventType === 'INSERT' ? 'New RSVP Response' : 'RSVP Updated',
          message: `Someone has ${payload.eventType === 'INSERT' ? 'submitted' : 'updated'} their RSVP`,
          timestamp: new Date().toISOString(),
          read: false
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]);
        setUnreadCount(prev => prev + 1);

        // Play notification sound
        if ('Audio' in window) {
          try {
            const audio = new Audio('/sounds/notification.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {
              // Ignore audio play errors
            });
          } catch (error) {
            // Ignore audio errors
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      adminAuth.logout('manual');
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(true);
    setUnreadCount(0);
    // Mark notifications as read
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className={cn('min-h-screen bg-gray-50 flex', className)}>
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 shadow-sm"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Wedding Admin</h1>
              <p className="text-sm text-gray-500">Dale & Kirsten</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavItem
              key={item.view}
              icon={item.icon}
              label={item.label}
              view={item.view}
              isActive={currentView === item.view}
              onClick={() => onViewChange(item.view)}
            />
          ))}
        </nav>

        {/* Session Info & Logout */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <SessionTimer />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="lg:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Mobile Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <HeartIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-gray-900">Wedding Admin</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {navigationItems.map((item) => (
                  <NavItem
                    key={item.view}
                    icon={item.icon}
                    label={item.label}
                    view={item.view}
                    isActive={currentView === item.view}
                    onClick={() => {
                      onViewChange(item.view);
                      setIsMobileMenuOpen(false);
                    }}
                  />
                ))}
              </nav>

              {/* Mobile Footer */}
              <div className="p-4 border-t border-gray-200 space-y-3">
                <SessionTimer />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>

              {/* Page Title */}
              <div className="hidden lg:block">
                <h2 className="text-xl font-semibold text-gray-900 capitalize">
                  {currentView}
                </h2>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <BellIcon className="w-6 h-6 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* User Info */}
                <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">A</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Admin</div>
                    <div className="text-gray-500">Wedding Dashboard</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowNotifications(false)}
            />
            <NotificationsPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;