import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  spotifyId?: string;
  refreshToken?: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  spotifyId: { type: String },
  refreshToken: { type: String },
});

export default mongoose.model<IUser>('User', UserSchema);
