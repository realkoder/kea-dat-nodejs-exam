import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const chatroomSchema = new mongoose.Schema({
  chatroomName: String,
  chatroomUserCreatorId: String,
  color: String,
  members: [String],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

chatroomSchema.plugin(timestamp);

const Chatroom = mongoose.model('Chatroom', chatroomSchema);

export default Chatroom;
