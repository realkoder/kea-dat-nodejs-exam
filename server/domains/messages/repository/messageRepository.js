import Message from '../model/Message.js';
import prefixedLogger from '../../../utils/logger.js';

const databaseLogger = prefixedLogger('🍃 [Database]: ');

function create() {
  return Message.create;
}
