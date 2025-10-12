import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const MessageSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const ChatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  messages: [MessageSchema],
}, { timestamps: true });

export default model('Chat', ChatSchema);
