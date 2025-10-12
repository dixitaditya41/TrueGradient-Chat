import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: false },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: false },
  credits: { type: Number, default: 1500 }, 
  password: { type: String }, 
  googleId: { type: String },
  authProvider: { type: String, default: "local" },
  organizations: [{ type: Schema.Types.ObjectId, ref: 'Organization' }], // orgs user belongs to
  activeOrganization: { type: Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default model('User', UserSchema);
