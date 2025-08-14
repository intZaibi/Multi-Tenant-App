import { Router } from 'express';

const router = Router();

import { getNotifications, getUnreadNotifications, markAsRead, getNotificationStats, getTenantNotificationStats, deleteNotification } from '../controllers/notificationController.js';

router.get('/get-notifications', getNotifications);
router.get('/get-unread-notifications', getUnreadNotifications);
router.post('/mark-as-read', markAsRead);
router.delete('/:id', deleteNotification);
router.get('/stats/overview', getNotificationStats);
router.get('/stats/tenant/:tenantId', getTenantNotificationStats);

export default router;