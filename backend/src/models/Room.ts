import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  playlist: [{ type: String }], // Array of song IDs or URLs
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
