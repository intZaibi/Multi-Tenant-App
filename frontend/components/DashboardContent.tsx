'use client';

import { cn, getRoleColor } from '@/services/utils';
import NotificationStatsWidget from './ui/NotificationStatsWidget';
import type { User } from '@/services/auth';
import {
  Users,
  Building2,
  Bell,
  TrendingUp,
  Activity,
  Shield,
  UserCheck,
  BarChart3,
} from 'lucide-react';

interface DashboardContentProps {
  user: User;
}

export default function DashboardContent({ user }: DashboardContentProps) {

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return Shield;
      case 'Admin':
        return UserCheck;
      case 'Manager':
        return BarChart3;
      default:
        return Users;
    }
  };

  const RoleIcon = getRoleIcon(user?.role || '' as string);

  const getDashboardWidgets = () => {
    const baseWidgets = [
      {
        title: 'Total Users',
        value: '1,234',
        change: '+12%',
        changeType: 'positive' as const,
        icon: Users,
        color: 'bg-blue-500',
      },
      {
        title: 'Active Tenants',
        value: '45',
        change: '+5%',
        changeType: 'positive' as const,
        icon: Building2,
        color: 'bg-green-500',
      },
      {
        title: 'Notifications',
        value: '23',
        change: '-3%',
        changeType: 'negative' as const,
        icon: Bell,
        color: 'bg-yellow-500',
      },
      {
        title: 'System Health',
        value: '98%',
        change: '+2%',
        changeType: 'positive' as const,
        icon: Activity,
        color: 'bg-purple-500',
      },
    ];

    // Filter widgets based on user role
    if (user?.role === 'User') {
      return baseWidgets.slice(2, 4); // Only show notifications and system health
    } else if (user?.role === 'Manager') {
      return baseWidgets.slice(1, 4); // Show tenants, notifications, and system health
    } else if (user?.role === 'Admin') {
      return baseWidgets.slice(0, 3); // Show users, tenants, and notifications
    }

    return baseWidgets; // Super Admin sees all widgets
  };

  const widgets = getDashboardWidgets();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <RoleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back {user?.first_name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your {user?.role.toLowerCase()} dashboard today.
            </p>
          </div>
          <div className="ml-auto">
            <span className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
              getRoleColor(user?.role || '')
            )}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((widget, index) => {
          const Icon = widget.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {widget.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {widget.value}
                  </p>
                </div>
                <div className={cn(
                  'h-12 w-12 rounded-lg flex items-center justify-center',
                  widget.color
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp
                  className={cn(
                    'h-4 w-4 mr-1',
                    widget.changeType === 'positive'
                      ? 'text-green-500'
                      : 'text-red-500'
                  )}
                />
                <span
                  className={cn(
                    'text-sm font-medium',
                    widget.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  )}
                >
                  {widget.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  from last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notification Statistics Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NotificationStatsWidget 
          userRole={user?.role || ''} 
          className="lg:col-span-1"
        />
        
      </div>

      {/* Role-specific content */}
      {user?.role === 'Super Admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Tenants</span>
                <span className="font-semibold text-gray-900 dark:text-white">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Active Users</span>
                <span className="font-semibold text-gray-900 dark:text-white">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">System Uptime</span>
                <span className="font-semibold text-green-600 dark:text-green-400">99.9%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  New tenant "TechCorp" registered
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  User John Doe logged in
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  System maintenance completed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'Admin' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tenant Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">156</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">142</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">14</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending Invites</div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'Manager' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Team Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Team Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">85%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Active Projects</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'User' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            My Dashboard
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Notifications</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome to the platform! Your account has been activated.
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Please complete your profile information.
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                  View Profile
                </button>
                <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                  Check Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
