import chatroomRepository from '../repository/chatroomRepository.js';
import prefixedLogger from '../../../utils/logger.js';

const serviceLogger = prefixedLogger('🔧 [Service]: ');

function getChatrooms() {
  serviceLogger.info('Gonna fetch Chatrooms');
  return chatroomRepository.getChatrooms();
}

function getChatroomsById(userId) {
  serviceLogger.info('Gonna fetch Chatrooms by userId');
  return chatroomRepository.getChatroomsById(userId);
}

function createNewChatroom(chatroom) {
  serviceLogger.info('Creating new Chatroom');
  return chatroomRepository.create(chatroom);
}

function findByIdPopulatedWithMessages(chatroomId) {
  serviceLogger.info(`Searching for chatroom with id: ${chatroomId}`);
  return chatroomRepository.findByIdPopulatedWithMessages(chatroomId);
}

function updateChatroomById(chatroomId, chatroom) {
  serviceLogger.info(`Updating chatroom with id: ${chatroomId}`);
  return chatroomRepository.updateChatroomById(chatroomId, chatroom);
}

function deleteChatroomById(chatroomId) {
  serviceLogger.info(`Gonna delete chatroom with id: ${chatroomId}`);
  return chatroomRepository.deleteById(chatroomId);
}

export default {
  getChatrooms,
  getChatroomsById,
  createNewChatroom,
  findByIdPopulatedWithMessages,
  updateChatroomById,
  deleteChatroomById,
};
