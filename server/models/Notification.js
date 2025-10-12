import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // null for global
  type: { type: String, enum: ['global', 'target'], default: 'target' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default model('Notification', NotificationSchema);
