import Login from '../model/Login.js';
import prefixedLogger from '../../../utils/logger.js';

const databaseLogger = prefixedLogger('🍃 [Database]: ');

function findByUsername(username) {
  return Login.findOne({ username })
    .then(foundLogin => {
      databaseLogger.info('Login with username found');
      return foundLogin;
    })
    .catch(error => {
      databaseLogger.error(`Username didn't match any login: ${username}`);
      throw error;
    });
}

function findUserById(userId) {
  return Login.findById(userId)
    .then(foundLogin => {
      databaseLogger.info('Login found with userId');
      return foundLogin;
    })
    .catch(error => {
      databaseLogger.info("Id didn't match with any login");
      throw error;
    });
}

function create(login) {
  return Login.create(login)
    .then(createdLogin => {
      databaseLogger.info(`Created new login, for userId: ${createdLogin.id}`);
      return createdLogin;
    })
    .catch(error => {
      databaseLogger.info(`Error creating login: ${error}`);
      throw error;
    });
}

function updateLogin(userId, newPassword) {
  const filter = { _id: userId };
  const update = { password: newPassword };

  return Login.findByIdAndUpdate(filter, update, { new: true })
    .then(updatedLogin => {
      databaseLogger.info('Login password updated successfully');
      return updatedLogin;
    })
    .catch(error => {
      databaseLogger.error(`Error updating login password: ${error}`);
      throw error;
    });
}

export default {
  create,
  findByUsername,
  findUserById,
  updateLogin,
};
