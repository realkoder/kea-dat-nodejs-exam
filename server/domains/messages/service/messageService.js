import messageRepository from '../repository/messageRepository.js';
import prefixedLogger from '../../../utils/logger.js';

const serviceLogger = prefixedLogger('🔧 [Service]: ');

function createNewMessage(message) {
  serviceLogger.info('Creating new Message');
  return messageRepository.create(message);
}

function getMessages() {
  serviceLogger.info('Fetching messages');
  return messageRepository.get();
}

function updateMessageById(messageId, message) {
  serviceLogger.info(`Updating message with id: ${messageId}`);
  return messageRepository.updateMessageById(messageId, message);
}

function deleteMessageById(messageId) {
  serviceLogger.info(`Gonna delete message with id: ${messageId}`);
  return messageRepository.deleteById(messageId);
}

export default {
  createNewMessage,
  getMessages,
  updateMessageById,
  deleteMessageById,
};
