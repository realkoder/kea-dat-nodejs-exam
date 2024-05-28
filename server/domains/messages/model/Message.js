import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const messageSchema = new mongoose.Schema({
  userId: String,
  textMessage: String,
  chatroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chatroom' },
});

messageSchema.plugin(timestamp);

const Message = mongoose.model('Message', messageSchema);

export default Message;
