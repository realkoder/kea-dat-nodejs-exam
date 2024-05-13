import Message from '../model/Message.js';
import prefixedLogger from '../../../utils/logger.js';
import Chatroom from '../../chatrooms/model/Chatroom.js';

const databaseLogger = prefixedLogger('🍃 [Database]: ');

function create(message) {
  return Message.create(message)
    .then(createdMessage => {
      databaseLogger.info(`Message created with id: ${createdMessage.id}`);
      // Update the corresponding chatroom's messages array
      return Chatroom.findByIdAndUpdate(message.chatroomId, { $push: { messages: createdMessage._id } }, { new: true })
        .then(updatedChatroom => {
          if (!updatedChatroom) {
            databaseLogger.info(`Chatroom was not able to be updated with new message.`);
            return createdMessage.id;
          } else {
            databaseLogger.info(`Chatroom ${updatedChatroom.chatroomName} updated with new message.`);
            return createdMessage.id;
          }          
        });
    })
    .catch(error => {
      databaseLogger.error(`Error creating message: ${message} - error: ${error}`);
      throw error;
    });
}

function get() {
  return Message.find()
    .then(fetchedMessages => {
      databaseLogger.info(`Messages fetched`);
      return fetchedMessages;
    })
    .catch(error => {
      databaseLogger.error(`Error fetching messages - error: ${error}`);
      throw error;
    });
}

function updateMessageById(messageId, message) {
  const filter = { _id: messageId };
  const { id, _id, ...updatedFields } = { ...message };
  return Message.findByIdAndUpdate(filter, updatedFields, { new: true })
    .then(updatedMessage => {
      databaseLogger.info(`Updated message with id: ${messageId}`);
      return updatedMessage;
    })
    .catch(error => {
      databaseLogger.info(`Error updating message: ${error}`);
    });
}

function deleteById(messageId) {
  return Message.findByIdAndDelete({_id: messageId})
    .then((result) => {
      if (result === null) {
        databaseLogger.info(`No message with Id: ${messageId}`);
        return false;
      } else {
        databaseLogger.info(`Deleted message with Id: ${messageId}`);
        return true;
      }
    })
    .catch(error => {
      databaseLogger.error(`Wasn't able to delete message with id: ${messageId} - error: ${error}`);
      throw error;
    });
}

export default {
  create,
  get,
  updateMessageById,
  deleteById,
};
