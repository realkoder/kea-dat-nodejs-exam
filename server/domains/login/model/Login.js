import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
  secretPhrase: String,
});

loginSchema.plugin(timestamp);

const Login = mongoose.model('Login', loginSchema);

export default Login;
