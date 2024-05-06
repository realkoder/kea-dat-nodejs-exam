import escape from 'escape-html';
import prefixedLogger from '../../utils/logger.js';

const routerLogger = prefixedLogger('🛰 [router]: ');

export default function escapeXSSMiddleware(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    const escapeRequestBody = body => {
      Object.keys(body).forEach(key => {
        if (typeof body[key] === 'string') {
          const original = body[key];
          const escaped = escape(body[key]);
          if (original !== escaped) {
            body[key] = escaped;
            routerLogger.info(`Escaped potentially dangerous content in key: ${key}`);
          }
        } else if (typeof body[key] === 'object' && body[key] !== null) {
          // Recursively escape nested objects
          escapeRequestBody(body[key]);
          routerLogger.info(`Checked for potentially dangerous nested content in key: ${key}`);
        }
      });
    };

    if (req.body) {
      try {
        escapeRequestBody(req.body);
      } catch (error) {
        return res.status(500).send('Error processing request');
      }
    }
  }
  next();
}
