import 'dotenv/config';
import jwt from 'jsonwebtoken';
import prefixedLogger from '../../utils/logger.js';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const serviceLogger = prefixedLogger('🔧 [Service]: ');

function generateAccessToken(payload) {
  const { exp, ...cleanPayload } = payload;
  return jwt.sign(cleanPayload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export const loginMiddleware = payload => {
  const accessToken = generateAccessToken(payload, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const authenticateToken = (req, res, next) => {
  serviceLogger.info('Validating jwt tokens!');
  const { accessToken } = req.cookies;
  const { refreshToken } = req.cookies;

  if (!accessToken) {
    if (!refreshToken) {
      serviceLogger.info('NO REFRESH TOKEN FOUND!');
      return res.sendStatus(401); // No valid refresh token provided
    }
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) {
        serviceLogger.error('Invalid Refresh Token!');
        return res.sendStatus(401); // Invalid refresh token
      }
      const newAccessToken = generateAccessToken(payload);
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        maxAge: 15 * 1000, // 15 seconds
      });
      serviceLogger.info('RefreshToken validated and new accessToken sent');
      next();
    });
  } else {
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        serviceLogger.error('Invalid Access Token!');
        return res.sendStatus(403); // Other errors (invalid token etc.)
      }
      serviceLogger.info('AccessToken validated');
      next(); // Token is valid
    });
  }
};
