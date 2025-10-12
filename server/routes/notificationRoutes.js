import express from 'express';
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount
} from '../controllers/notificationController.js';
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

// Get all notifications for current user
router.get('/', getUserNotifications);

// Get unread notification count
router.get('/unread-count', getUnreadCount);

// Mark a specific notification as read
router.patch('/:notificationId/read', markNotificationRead);

// Mark all notifications as read
router.patch('/mark-all-read', markAllNotificationsRead);

export default router;
