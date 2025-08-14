import db from '../config/db.js';

const getNotifications = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM notifications WHERE user_id = ?', [req.user.userId]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No notifications found' });
    }
    res.status(200).json({ message: 'Notifications fetched successfully!', notifications: rows });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}

const getUnreadNotifications = async (req, res) => {  
  try {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', [req.user.userId]);
    res.status(200).json({ message: 'Unread notifications fetched successfully!', count: rows[0].count });
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    res.status(500).json({ error: 'Failed to fetch unread notifications' });
  }
}

const markAsRead = async (req, res) => {
  const { notificationId } = req.body;
  try {
    const [rows] = await db.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [notificationId]);
    if (rows.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification marked as read!' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
}

const deleteNotification = async (req, res) => {
  try {
    const [rows] = await db.query('DELETE FROM notifications WHERE id = ?', [req.params.id]);
    if (rows.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully!' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
}


// Get notification statistics
const getNotificationStats = async (req, res, next) => {
  try {
    // Get total notifications
    const [totalResult] = await db.execute(
      'SELECT COUNT(*) as total FROM notifications WHERE user_id = ?',
      [req.user.userId]
    );

    // Get unread notifications
    const [unreadResult] = await db.execute(
      'SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.user.userId]
    );

    // Get notifications by type
    const [typeResult] = await db.execute(
      `SELECT 
        type,
        COUNT(*) as count
       FROM notifications 
       WHERE user_id = ?
       GROUP BY type`,
      [req.user.userId]
    );

    // Get recent notifications (last 7 days)
    const [recentResult] = await db.execute(
      'SELECT COUNT(*) as recent FROM notifications WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)',
      [req.user.userId]
    );

    res.json({
      success: true,
      data: {
        total: totalResult[0].total,
        unread: unreadResult[0].unread,
        read: totalResult[0].total - unreadResult[0].unread,
        by_type: typeResult,
        recent_7_days: recentResult[0].recent
      }
    });

  } catch (error) {
    next(error);
  }
};

// Admin: Get notification statistics for tenant
const getTenantNotificationStats = async (req, res, next) => {
  const tenantId = req.params.tenantId;
  try {
    // Get total notifications for tenant
    const [totalResult] = await db.execute(
      `SELECT COUNT(*) as total 
       FROM notifications n
       JOIN users u ON n.user_id = u.user_id
       WHERE u.tenant_id = ?`,
      [tenantId]
    );

    // Get unread notifications for tenant
    const [unreadResult] = await db.execute(
      `SELECT COUNT(*) as unread 
       FROM notifications n
       JOIN users u ON n.user_id = u.user_id
       WHERE u.tenant_id = ? AND n.is_read = 0`,
      [tenantId]
    );

    // Get notifications by type for tenant
    const [typeResult] = await db.execute(
      `SELECT 
        n.type,
        COUNT(*) as count
       FROM notifications n
       JOIN users u ON n.user_id = u.user_id
       WHERE u.tenant_id = ?
       GROUP BY n.type`,
      [tenantId]
    );

    // Get notifications by user for tenant
    const [userResult] = await db.execute(
      `SELECT 
        u.first_name,
        u.last_name,
        COUNT(n.id) as notification_count,
        COUNT(CASE WHEN n.is_read = 0 THEN 1 END) as unread_count
       FROM users u
       LEFT JOIN notifications n ON u.user_id = n.user_id
       WHERE u.tenant_id = ?
       GROUP BY u.user_id
       ORDER BY notification_count DESC`,
      [tenantId]
    );


    res.json({
      success: true,
      data: {
        total: totalResult[0].total,
        unread: unreadResult[0].unread,
        read: totalResult[0].total - unreadResult[0].unread,
        by_type: typeResult,
        by_user: userResult
      }
    });

  } catch (error) {
    next(error);
  }
};

export { getNotifications, getUnreadNotifications, markAsRead, getNotificationStats, getTenantNotificationStats, deleteNotification };