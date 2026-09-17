const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true, lowercase: true, trim: true },
  code: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 360 },
});

module.exports = mongoose.model('Otp', otpSchema);
