import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  spotifyId: { type: String, required: true },
  role: { type: String, enum: ['owner', 'admin', 'member', 'guest'], default: 'member' },
});

const User = mongoose.model('User', userSchema);

export default User;
