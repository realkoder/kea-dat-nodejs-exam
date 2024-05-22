import Message from '../model/Message.js';
import prefixedLogger from '../../../utils/logger.js';
import Chatroom from '../../chatrooms/model/Chatroom.js';

const databaseLogger = prefixedLogger('🍃 [Database]: ');

function create(message) {
  return Message.create(message)
    .then(createdMessage => {
      databaseLogger.info(`Message created with id: ${createdMessage.id}`);
      // Update the corresponding chatroom's messages array
      return Chatroom.findByIdAndUpdate(
        message.chatroomId,
        { $push: { messages: createdMessage.toObject() } },
        { new: true },
      ).then(updatedChatroom => {
        if (!updatedChatroom) {
          databaseLogger.info(`Chatroom was not able to be updated with new message.`);
          return createdMessage.id;
        } else {
          databaseLogger.info(`Chatroom ${updatedChatroom.chatroomName} updated with new message.`);
          return createdMessage;
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

function getMessagesByChatroomId(chatroomId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return Message.find({ chatroomId: chatroomId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .then(fetchedMessages => {
      databaseLogger.info(`Messages fetched by chatroomId`);
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

async function deleteById(messageId) {
  try {
    const result = await Message.findByIdAndDelete({ _id: messageId });
    if (!result) {
      databaseLogger.info(`No message with Id: ${messageId}`);
      return false;
    }
    databaseLogger.info(`Deleted message with Id: ${messageId}`);

    const chatroomResult = await Chatroom.updateOne({ _id: result.chatroomId }, { $pull: { messages: messageId } });
    if (chatroomResult.modifiedCount === 0) {
      databaseLogger.info(`No chatroom updated for message Id: ${messageId}`);
    } else {
      databaseLogger.info(`Removed message reference from chatroom for message Id: ${messageId}`);
    }
    return true;
  } catch (error) {
    databaseLogger.error(`Wasn't able to delete message with id: ${messageId} - error: ${error.message}`, error);
    throw error;
  }
}

export default {
  create,
  get,
  getMessagesByChatroomId,
  updateMessageById,
  deleteById,
};
