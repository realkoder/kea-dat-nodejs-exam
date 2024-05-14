import UserRepository from '../repository/UserRepository.js';
import prefixedLogger from '../../../utils/logger.js';

const serviceLogger = prefixedLogger('🔧 [Service]: ');

function getUsers() {
  serviceLogger.info('Gonna fetch Users');
  const modifiedUsers = UserRepository.get().then(result =>
    result.map(user => ({ id: user.id, name: user.name, email: user.email })),
  );
  return modifiedUsers;
}

function createNewuser(user) {
  serviceLogger.info('Creating new User');
  return UserRepository.create(user);
}

function findUserByEmail(userEmail) {
  serviceLogger.info(`Searching for user with email: ${userEmail}`);
  return UserRepository.findByEmail(userEmail);
}

function updateUserById(userId, user) {
  serviceLogger.info(`Updating user with id: ${userId}`);
  return UserRepository.updateUserById(userId, user);
}

function deleteUserById(userId) {
  serviceLogger.info(`Deleting user with id: ${userId}`);
  return UserRepository.deleteById(userId);
}

export default {
  getUsers,
  createNewuser,
  findUserByEmail,
  updateUserById,
  deleteUserById,
};
