/**
 * Admin Dashboard Overview
 * Dale & Kirsten's Wedding Admin Dashboard
 * 
 * Comprehensive dashboard with statistics, charts, and real-time updates
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import { cn } from '../../lib/utils';
import { WeddingStatistics, StatisticsCardProps, ChartData } from '../../types/admin';
import adminSupabase from '../../lib/adminSupabase';

interface AdminDashboardProps {
  className?: string;
}

// Statistics Card Component
const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  className
}) => {
  const colorClasses = {
    rose: 'from-rose-500 to-pink-500 text-rose-600',
    green: 'from-green-500 to-emerald-500 text-green-600',
    blue: 'from-blue-500 to-indigo-500 text-blue-600',
    yellow: 'from-yellow-500 to-orange-500 text-yellow-600',
    purple: 'from-purple-500 to-violet-500 text-purple-600',
  };

  return (
    <motion.div
      className={cn(
        'bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg',
        'hover:shadow-xl transition-all duration-200',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center',
              colorClasses[color].replace('text-', 'from-').replace('to-', 'to-')
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              {trend && (
                <div className={cn(
                  'flex items-center gap-1 text-xs',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}>
                  {trend.isPositive ? (
                    <ArrowUpIcon className="w-3 h-3" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3" />
                  )}
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className={cn('text-3xl font-bold', colorClasses[color])}>
              {value}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Simple Chart Component (using CSS for basic visualization)
const MealChoiceChart: React.FC<{ data: { [key: string]: { count: number; percentage: number } } }> = ({ data }) => {
  const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
  const entries = Object.entries(data);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Meal Choice Distribution</h3>
      
      <div className="space-y-3">
        {entries.map(([choice, stats], index) => (
          <motion.div
            key={choice}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {choice.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500">
                  {stats.count} ({stats.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {entries.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ChartBarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No meal choices recorded yet</p>
        </div>
      )}
    </div>
  );
};

// Response Timeline Chart
const ResponseTimeline: React.FC<{ data: Array<{ date: string; responses: number; cumulative: number }> }> = ({ data }) => {
  const maxCumulative = Math.max(...data.map(d => d.cumulative), 1);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Timeline</h3>
      
      <div className="space-y-2">
        {data.slice(-7).map((item, index) => (
          <motion.div
            key={item.date}
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="w-20 text-xs text-gray-500">
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-700">
                  {item.responses} new response{item.responses !== 1 ? 's' : ''}
                </span>
                <span className="text-xs text-gray-500">
                  Total: {item.cumulative}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.cumulative / maxCumulative) * 100}%` }}
                  transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ClockIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No responses recorded yet</p>
        </div>
      )}
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ className }) => {
  const [statistics, setStatistics] = useState<WeddingStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStatistics = useCallback(async () => {
    try {
      const result = await adminSupabase.getWeddingStatistics();
      if (result.success && result.data) {
        setStatistics(result.data);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadStatistics();
  };

  useEffect(() => {
    loadStatistics();

    // Set up real-time updates
    const unsubscribe = adminSupabase.subscribeToRSVPUpdates(
      () => {
        // Reload statistics when there's an update
        loadStatistics();
      },
      (error) => {
        console.error('Real-time subscription error:', error);
      }
    );

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(loadStatistics, 30000);

    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [loadStatistics]);

  if (isLoading) {
    return (
      <div className={cn('p-6', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/80 rounded-2xl p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-300 rounded-xl mb-3" />
              <div className="h-4 bg-gray-300 rounded mb-2 w-3/4" />
              <div className="h-8 bg-gray-300 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className={cn('p-6', className)}>
        <div className="text-center py-12">
          <p className="text-gray-500">Unable to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6 space-y-8', className)}>
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <HeartIcon className="w-8 h-8 text-rose-500" />
            Wedding Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Dale & Kirsten • October 31st, 2025
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={cn(
              'px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl',
              'flex items-center gap-2 transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2',
              isRefreshing && 'opacity-50 cursor-not-allowed'
            )}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowPathIcon className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticsCard
          title="Total Guests"
          value={statistics.totalGuests.toString()}
          subtitle="Invited to the wedding"
          icon={UsersIcon}
          color="blue"
        />
        
        <StatisticsCard
          title="Responses"
          value={statistics.totalResponses.toString()}
          subtitle={`${statistics.responseRate.toFixed(1)}% response rate`}
          icon={CheckCircleIcon}
          color="green"
        />
        
        <StatisticsCard
          title="Attending"
          value={statistics.attendingCount.toString()}
          subtitle={`${statistics.notAttendingCount} can't make it`}
          icon={HeartIcon}
          color="rose"
        />
        
        <StatisticsCard
          title="Pending"
          value={statistics.pendingCount.toString()}
          subtitle="Awaiting response"
          icon={ClockIcon}
          color="yellow"
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatisticsCard
          title="Email Confirmations"
          value={statistics.emailConfirmationsSent.toString()}
          subtitle={`${statistics.totalResponses > 0 ? 
            ((statistics.emailConfirmationsSent / statistics.totalResponses) * 100).toFixed(1) : 0}% confirmed`}
          icon={EnvelopeIcon}
          color="purple"
        />
        
        <StatisticsCard
          title="Response Rate"
          value={`${statistics.responseRate.toFixed(1)}%`}
          subtitle={`${statistics.pendingCount} still pending`}
          icon={ChartBarIcon}
          color="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MealChoiceChart data={statistics.mealChoiceBreakdown} />
        <ResponseTimeline data={statistics.responseTimeline} />
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="bg-white/20 hover:bg-white/30 rounded-xl p-4 text-left transition-colors duration-200">
            <h4 className="font-medium mb-1">Send Reminders</h4>
            <p className="text-sm opacity-90">To pending guests</p>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-xl p-4 text-left transition-colors duration-200">
            <h4 className="font-medium mb-1">Export Data</h4>
            <p className="text-sm opacity-90">For wedding planning</p>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-xl p-4 text-left transition-colors duration-200">
            <h4 className="font-medium mb-1">Manage Guests</h4>
            <p className="text-sm opacity-90">View and edit</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;