import express from 'express';
import authRoutes from './authRoutes.js';
import organizationRoutes from './organizationRoutes.js';
import chatRoutes from './chatRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/organization', organizationRoutes);
router.use('/chat', chatRoutes);
router.use('/notifications', notificationRoutes);

export default router;
