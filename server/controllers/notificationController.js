import Notification from '../models/Notification.js';
import { sendTargetNotification } from '../utils/socket.js';

// Get all notifications for the current user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get both user-specific and global notifications
    const notifications = await Notification.find({
      $or: [
        { user: userId },
        { type: 'global' }
      ]
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark a notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Check if user can mark this notification as read
    if (notification.user && notification.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { 
        $or: [
          { user: userId },
          { type: 'global' }
        ],
        read: false 
      },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
      $or: [
        { user: userId },
        { type: 'global' }
      ],
      read: false
    });

    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
