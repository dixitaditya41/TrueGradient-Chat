import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.route('/')
  .get(getChatHistory);

router.route('/send')
  .post(sendMessage);

export default router;
