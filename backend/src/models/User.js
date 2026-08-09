const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    googleId: { type: String },
    avatar: { type: String }, // Cloudinary URL
    bio: { type: String },
    isActive: { type: Boolean, default: true },
    stripeAccountId: { type: String }, // For Stripe Connect
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);