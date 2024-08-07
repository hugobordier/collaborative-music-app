import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
}

const RoomSchema: Schema = new Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model<IRoom>('Room', RoomSchema);
