export interface NotificationSummary {
  total_notifications: number;
  unread_notifications: number;
  read_notifications: number;
  notifications_by_type: {
    info: number;
    success: number;
    warning: number;
    error: number;
  };
}

export type Notification = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: number; // 0 or 1
  created_at: string;
};

export interface TenantStats {
  total: number;
  unread: number;
  read: number;
  by_type: Array<{
    type: string;
    count: number;
  }>;
  by_user: Array<{
    first_name: string;
    last_name: string;
    notification_count: number;
    unread_count: number;
  }>;
}

export interface NotificationStatsWidgetProps {
  userRole: string;
  className?: string;
}