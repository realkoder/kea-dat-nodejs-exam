import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
  }, 
});

userSchema.plugin(timestamp);

const User = mongoose.model('User', userSchema);

export default User;
