import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth/authMiddleware.js';
import LoginController from '../../domains/login/controller/loginController.js';

// Security RateLimiting Middelwares
import { sensitiveLimiter } from '../../middlewares/auth/rateLimitMiddleware.js';

const router = Router();

// GET
router.get('/verifyAuth', authenticateToken, LoginController.isLoggedIn);

// GET
router.get('/logout', authenticateToken, LoginController.logout);

// POST
router.post('/', LoginController.createNewUserWithLogin);

// POST
router.post('/verify', LoginController.verifyLoginAccount);

// router.post('/login', sensitiveLimiter, LoginController.loginWithCredentials);
router.post('/login', LoginController.loginWithCredentials);

router.post('/forgot-password', sensitiveLimiter, LoginController.sendEmailForPasswordReset);

// PUT
router.put('/reset-password', sensitiveLimiter, LoginController.resetPasswordForUser);

export default router;
