import { Router } from 'express';
import userRouter from './user/userRoutes.js';
import chatroomRouter from './chatroom/chatroomRoutes.js';
import messageRouter from './messages/messageRoutes.js';
import authRouter from './auth/loginRoutes.js';

// AuthMiddlewares
import { authenticateToken } from '../middlewares/auth/authMiddleware.js';

// Security RateLimiting Middelwares
import { apiLimiter } from '../middlewares/auth/rateLimitMiddleware.js';

const router = Router();

router.use('/users', apiLimiter, authenticateToken, userRouter);
router.use('/chatrooms', apiLimiter, authenticateToken, chatroomRouter);
router.use('/messages', apiLimiter, authenticateToken, messageRouter);
router.use('/auth', authRouter);

export default router;
