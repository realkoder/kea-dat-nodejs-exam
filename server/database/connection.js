
import 'dotenv/config';
import mongoose from "mongoose";
import prefixedLogger from '../utils/logger.js';

const databaseLogger = prefixedLogger('🍃 [Database]: ');

class DatabaseConnection {
  static instance = null;

  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    DatabaseConnection.instance = this;
  }

  connect() {
    if (this.db) {
      return Promise.resolve(this.db);
    }

    return mongoose.connect(process.env.DB_HOST_URI, {
      autoIndex: true,
      dbName: 'chat_awesome',
    })
    .then((dbClient) => {
      this.dbClient = dbClient;
      this.db = dbClient.connection;
      databaseLogger.info('Successfully connected to database: chat_awesome!');
      return this.db;
    })
    .catch((error) => {
      databaseLogger.error(`Error connecting to the database: ${ error.message }`);
      throw error;
    });
  }

  disconnect() {
    if (this.dbClient) {
      return this.dbClient.disconnect().then(() => {
        databaseLogger.info('Database connection closed');
      })
      .catch((error) => {
        databaseLogger.error(`Error disconnecting from the database: ${ error.message }`);
        throw error;
      });
    } else {
      return Promise.resolve();
    }
  }
}

const databaseConnection = new DatabaseConnection();
Object.freeze(databaseConnection);

process.on('SIGINT', () => {
  databaseConnection.disconnect().then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  databaseConnection.disconnect().then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
});

export default databaseConnection;
