import chatroomRepository from '../repository/chatroomRepository.js';
import prefixedLogger from '../../../utils/logger.js';

const serviceLogger = prefixedLogger('🔧 [Service]: ');

function getChatrooms() {
  serviceLogger.info('Fetching Chatrooms');
  return chatroomRepository.getChatrooms();
}

function getChatroomsById(userId) {
  serviceLogger.info('Fetching Chatrooms by userId');
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
  serviceLogger.info(`Update chatroom with id: ${chatroomId}`);
  return chatroomRepository.updateChatroomById(chatroomId, chatroom);
}

function deleteChatroomById(chatroomId) {
  serviceLogger.info(`Delete chatroom with id: ${chatroomId}`);
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
