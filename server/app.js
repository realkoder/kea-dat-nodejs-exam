import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import path from 'path';
import browserSync from 'browser-sync';

// Logger
import pinoHttp from 'pino-http';
import prefixedLogger from './utils/logger.js';

// Redis
import redisConnection from './redis/connection.js';

// Database
import databaseConnection from './database/connection.js';
import setupDatabase from './database/setupDatabase.js';

// Middlewares
import escapeXSSMiddleware from './middlewares/security/xssMiddleware.js';
import errorHandlerMiddleware from './middlewares/error/errorMiddleware.js';

// Routes
import ServerRoutes from './routes/serverRoutes.js';

const { PORT, SESSION_SECRET, NODE_ENV } = process.env;
const isDeleteMode = process.argv.includes('delete');

// Loggers
const serverLogger = prefixedLogger('📦 [server]: ');
const routerLogger = prefixedLogger('🛰 [router]: ');
const httpLogger = pinoHttp({ routerLogger, autoLogging: false }); // <--- should be manually added when you want to log full requests.

// AppInitialization
const app = express();
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV === 'production',
  }),
);
app.use(
  cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true,
  }),
);

/**
 * Disabling the 'X-Powered-By: Express' header is a security best practice to prevent potential
 * attackers from identifying the technology stack being used, which can help in reducing the risk of
 * targeted attacks.
 */
app.disable('x-powered-by');
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: 'localhost',
      secure: NODE_ENV === 'production', // should be true in production
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour
    },
  }),
);
app.use(escapeXSSMiddleware);
app.use(httpLogger);
app.use(errorHandlerMiddleware);
app.use('/api/v1', ServerRoutes);

app.use(express.static(path.resolve('../client/dist')));
app.get('*', (req, res) => res.sendFile(path.resolve('../client/dist/index.html')));

if (NODE_ENV === 'development') {
  const bs = browserSync.create({ logLevel: 'silent' });
  app.listen(PORT || 8080, () => {
    serverLogger.info(`Express server listening on port: ${PORT || 8080}`);
    bs.init({
      proxy: `http://localhost:${PORT || 8080}`,
      files: ['../client/**/*.*'],
      ignore: '../client/node_modules/**/*.*',
      port: 3000,
      open: false,
      notify: false,
      https: false,
      reloadOnRestart: true,
      reloadDelay: 2000,
    });
    serverLogger.info(`Browser-sync proxying to port: ${PORT || 8080}`);
  });
} else {
  app.listen(PORT || 8080, () => {
    serverLogger.info(`Listening on port: ${PORT || 8080}`);
  });
}

(async () => {
  await redisConnection.connect();
  await databaseConnection.connect();
  setupDatabase(isDeleteMode);
})();