import 'dotenv/config';
import bcrypt from 'bcrypt';
import prefixedLogger from '../utils/logger.js';

// Mongoose Models
import User from '../domains/users/model/User.js';
import Login from '../domains/login/model/Login.js';
import Message from '../domains/messages/model/Message.js';
import Chatroom from '../domains/chatrooms/model/Chatroom.js';

const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

const databaseLogger = prefixedLogger('🍃 [Database]: ');

function setupDatabase(isDeleteMode) {
  if (isDeleteMode) {
    Promise.all([
      User.collection.drop(),
      Login.collection.drop(),
      Message.collection.drop(),
      Chatroom.collection.drop(),
    ]);

    databaseLogger.info('Dropped all collections');
  }

  Promise.all([
    User.createCollection()
      .then(() => databaseLogger.info('User collection is created'))
      .catch(error => databaseLogger.error(`Error creating User collection: ${error}`)),

    Login.createCollection()
      .then(() => databaseLogger.info('Login collection is created'))
      .catch(error => databaseLogger.error(`Error creating Login collection: ${error}`)),
  ]).finally(() => databaseLogger.info('Ensured collections exist [users, login, messages, chatrooms, ai_models]'));

  if (isDeleteMode) {
    const saltRounds = 14;

    User.create({
      name: 'admin',
      email: 'info@admin.com',
    })
      .then(async createdAdminUser => {
        databaseLogger.info('Created Admin user');
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

        return Login.create({
          _id: createdAdminUser.id,
          username: ADMIN_USERNAME,
          password: hashedPassword,
          verificationCode: 111111,
          isVerified: true,
        }).then(() => databaseLogger.info('Created login for admin user'));
      })
      .catch(error => databaseLogger.error(`Error creating admin user with login: ${error}`));

    User.create({
      _id: '663006030739377a94826bf3',
      name: 'jon doe',
      email: 'jondoe@testuser.com',
    })
      .then(async testUser => {
        databaseLogger.info('Created test user');
        const hashedPassword = await bcrypt.hash('test12345', saltRounds);

        return Login.create({
          _id: testUser.id,
          username: 'jondoe',
          password: hashedPassword,
          verificationCode: 111111,
          isVerified: true,
        }).then(() => databaseLogger.info('Created login for test user'));
      })
      .catch(error => databaseLogger.error(`Error creating test user with login: ${error}`));
  }
}

export default setupDatabase;
