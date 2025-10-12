import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const MemberSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' }
}, { _id: false });

const OrganizationSchema = new Schema({
  name: { type: String, required: true },
  members: [MemberSchema],
}, { timestamps: true });

export default model('Organization', OrganizationSchema);
