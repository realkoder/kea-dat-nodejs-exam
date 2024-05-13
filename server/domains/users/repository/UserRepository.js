import User from '../model/User.js';
import prefixedLogger from '../../../utils/logger.js';

const databaseLogger = prefixedLogger('🍃 [Database]: ');

function create(user) {
  return User.create(user)
    .then(createdUser => {
      databaseLogger.info(`User created with id: ${createdUser.id}`);
      return createdUser.id;
    })
    .catch(error => {
      databaseLogger.error(`Error creating user: ${user} - error: ${error}`);
      throw error;
    });
}

function findByEmail(userEmail) {
  return User.findOne({ email: userEmail })
    .then(foundUser => {
      databaseLogger.info(`User found with email: ${userEmail}`);
      databaseLogger.info(`User looks like: ${foundUser}`);
      return foundUser;
    })
    .catch(error => {
      databaseLogger.error(`No user with email: ${userEmail} - error: ${error}`);
      throw error;
    });
}

function updateUserById(userId, user) {
  const filter = { _id: userId };
  const { id, _id, ...updatedFields } = { ...user };
  return User.findByIdAndUpdate(filter, updatedFields, { new: true })
    .then(updatedUser => {
      databaseLogger.info(`Updated user with id: ${userId}`); // Corrected variable name
      return updatedUser;
    })
    .catch(error => {
      databaseLogger.info(`Error updating user: ${error}`);
    });
}

function deleteById(userId) {
  return User.findByIdAndDelete({_id: userId})
    .then((result) => {
      if (result === null) {
        databaseLogger.info(`No User with Id: ${userId}`);
        return false;
      } else {
        databaseLogger.info(`Deleted user with Id: ${userId}`);
        return true;
      }
    })
    .catch(error => {
      databaseLogger.error(`Wasn't able to delete user with id: ${userId} - error: ${error}`);
      throw error;
    });
}

export default {
  create,
  findByEmail,
  updateUserById,
  deleteById,
};
