import prefixedLogger from '../../../utils/logger.js';
import Chatroom from '../model/Chatroom.js';

const databaseLogger = prefixedLogger('🍃 [Database]: ');

function getChatrooms() {
  return Chatroom.find()
    .then(fetchedChatrooms => {
      databaseLogger.info(`Chatrooms fetched`);
      return fetchedChatrooms;
    })
    .catch(error => {
      databaseLogger.error(`Error fetching chatrooms - error: ${error}`);
      throw error;
    });
}

function getChatroomsById(userId, limit = 1) {
  return Chatroom.find({ $or: [{ chatroomUserCreatorId: userId }, { 'members._id': userId }] })
    .populate({
      path: 'messages',
      options: { sort: { createdAt: -1 }, limit: limit },
    })
    .then(fetchedChatrooms => {
      databaseLogger.info(`Chatrooms fetched by chatroomUserCreatorId`);
      return fetchedChatrooms;
    })
    .catch(error => {
      databaseLogger.error(`Error fetching chatrooms by chatroomUserCreatorId - error: ${error}`);
      throw error;
    });
}

function create(chatroom) {
  return Chatroom.create(chatroom)
    .then(createdChatroom => {
      databaseLogger.info(`Chatroom created with id: ${createdChatroom.id}`);
      return createdChatroom;
    })
    .catch(error => {
      databaseLogger.error(`Error creating chatroom: ${chatroom} - error: ${error}`);
      throw error;
    });
}

// Specific chatroom populated with messages based on limiter
function findByIdPopulatedWithMessages(chatroomId, limit = 10) {
  return Chatroom.findById({ _id: chatroomId })
    .populate({
      path: 'messages',
      options: { sort: { createdAt: -1 }, limit: limit },
    })
    .then(foundChatroom => {
      databaseLogger.info(`Chatroom found with id: ${chatroomId}`);
      return foundChatroom;
    })
    .catch(error => {
      databaseLogger.error(`Error finding chatroom with id ${chatroomId}: ${error}`);
      throw error;
    });
}

function updateChatroomById(chatroomId, chatroom) {
  const filter = { _id: chatroomId };
  const { id, _id, ...updatedFields } = { ...chatroom };
  return Chatroom.findByIdAndUpdate(filter, updatedFields, { new: true })
    .then(updatedChatroom => {
      databaseLogger.info(`Updated chatroom with id: ${chatroomId}`); // Corrected variable name
      return updatedChatroom;
    })
    .catch(error => {
      databaseLogger.info(`Error updating chatroom: ${error}`);
    });
}

function deleteById(chatroomId) {
  return Chatroom.findByIdAndDelete({ _id: chatroomId })
    .then(result => {
      if (result === null) {
        databaseLogger.info(`No chatroom with Id: ${chatroomId}`);
        return false;
      } else {
        databaseLogger.info(`Deleted chatroom with Id: ${chatroomId}`);
        return true;
      }
    })
    .catch(error => {
      databaseLogger.error(`Wasn't able to delete chatroom with id: ${chatroomId} - error: ${error}`);
      throw error;
    });
}

export default {
  getChatrooms,
  getChatroomsById,
  create,
  findByIdPopulatedWithMessages,
  updateChatroomById,
  deleteById,
};
