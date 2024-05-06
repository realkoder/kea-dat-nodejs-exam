import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const messageSchema = new mongoose.Schema({
  userId: String,
  textMessage: String,
  chatroomId: String,
});

messageSchema.plugin(timestamp);

const Message = mongoose.model('Message', messageSchema);

export default Message;
