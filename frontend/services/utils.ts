import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NotificationSummary, Notification, TenantStats } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getRoleColor(role: string) {
  switch (role) {
    case 'Super Admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'Admin':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Manager':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'User':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
}

export function getNotificationTypeColor(type: string) {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'info':
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  }
}


export const formatNotifications = (notifications: Notification[]): NotificationSummary => {
  const summary: NotificationSummary = {
    total_notifications: 0,
    unread_notifications: 0,
    read_notifications: 0,
    notifications_by_type: {
      info: 0,
      success: 0,
      warning: 0,
      error: 0,
    }
  };

  notifications.forEach((n) => {
    summary.total_notifications++;

    if (n.is_read) {
      summary.read_notifications++;
    } else {
      summary.unread_notifications++;
    }

    if (summary.notifications_by_type.hasOwnProperty(n.type)) {
      summary.notifications_by_type[n.type]++;
    }
  });

  return summary;
};

