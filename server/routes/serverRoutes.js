import { Router } from 'express';
import userRouter from './user/userRoutes.js';
import authRouter from './auth/loginRoutes.js';

// AuthMiddlewares
import { authenticateToken } from '../middlewares/auth/authMiddleware.js';

// Security RateLimiting Middelwares
import { apiLimiter } from '../middlewares/auth/rateLimitMiddleware.js';

const router = Router();

router.use('/users', apiLimiter, authenticateToken, userRouter);
router.use('/auth', authRouter);

export default router;
