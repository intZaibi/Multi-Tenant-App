'use client';

import { useState, useEffect } from 'react';
import { Bell, Users, EyeOff, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/services/utils';
import { getUserNotifications, getTenantNotificationStats } from '@/services/api';
import { NotificationSummary, TenantStats, NotificationStatsWidgetProps } from '@/lib/types';
import { formatNotifications } from '@/services/utils';
import { useSearchParams } from 'next/navigation';

export default function NotificationStatsWidget({ userRole, className }: NotificationStatsWidgetProps) {
  // url params
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenantId');

  const [userStats, setUserStats] = useState<NotificationSummary | null>(null);
  const [tenantStats, setTenantStats] = useState<TenantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canViewTenantStats = ['Super Admin', 'Admin'].includes(userRole);

  // Fetch user notification statistics
  const fetchUserStats = async () => {
    try {
      const response = await getUserNotifications();
      console.log("user stats response: ", response);
      if (response.error) throw new Error('Failed to fetch user stats');

      setUserStats(formatNotifications(response?.notifications));
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      setError('Failed to load notification statistics');
    }
  };

  // Fetch tenant notification statistics (for admins)
  const fetchTenantStats = async () => {
    if (!canViewTenantStats) return;

    try {
      const response = await getTenantNotificationStats(Number(tenantId));
      if (response.error) throw new Error('Failed to fetch tenant stats');
      setTenantStats(response?.data);
    } catch (error) {
      console.error('Failed to fetch tenant stats:', error);
    }
  };

  console.log("tenant stats: ", tenantStats); 

  // Get type icon and color
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'success':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
      case 'error':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' };
      default:
        return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' };
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchUserStats(),
          canViewTenantStats ? fetchTenantStats() : Promise.resolve()
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userRole]);

  if (loading) {
    return (
      <div className={cn('card p-6', className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('card p-6', className)}>
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('card p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Overview
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {canViewTenantStats ? 'Your notifications and tenant statistics' : 'Your notification statistics'}
          </p>
        </div>
      </div>

      {/* User Statistics */}
      {userStats && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Your Notifications</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 mx-auto mb-2">
                <Bell className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats?.total_notifications ?? 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 mx-auto mb-2">
                <EyeOff className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-600">{userStats?.unread_notifications ?? 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unread</p>
            </div>
          </div>

          {/* Read Rate */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Read Rate</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {userStats?.total_notifications > 0 
                  ? Math.round((userStats?.read_notifications / userStats?.total_notifications) * 100)
                  : 0
                }%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${userStats?.total_notifications > 0 
                    ? (userStats?.read_notifications / userStats?.total_notifications) * 100
                    : 0
                  }%` 
                }}
              ></div>
            </div>
          </div>

          {/* Type Distribution */}
          <div>
            <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">By Type</h5>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(userStats?.notifications_by_type ?? {}).map(([type, count]) => {
                const config = getTypeConfig(type);
                const Icon = config.icon;
                
                return (
                  <div key={type} className="flex items-center space-x-2">
                    <div className={cn('p-1 rounded', config.bg)}>
                      <Icon className={cn('h-3 w-3', config.color)} />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{type}</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tenant Statistics (for admins) */}
      {canViewTenantStats && tenantStats && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Tenant Overview
          </h4>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{tenantStats?.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600">{tenantStats?.unread}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Unread</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600">{tenantStats?.read}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Read</p>
            </div>
          </div>

          {/* Top Users */}
          {tenantStats?.by_user && tenantStats?.by_user.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Most Active Users</h5>
              <div className="space-y-1">
                {tenantStats?.by_user.slice(0, 3).map((user, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400 truncate">
                      {user.first_name} {user.last_name}
                    </span>
                    <div className="flex space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.notification_count}
                      </span>
                      {user.unread_count > 0 && (
                        <span className="text-red-500">({user.unread_count})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
