const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    visitId: { type: String, required: true, unique: true },

    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    company: { type: String, trim: true },
    designation: { type: String, trim: true },
    profilePhoto: { type: String },

    hostName: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    purpose: { type: String, trim: true },
    visitType: { type: String, trim: true },
    duration: { type: String, trim: true },
    reference: { type: String, trim: true },

    status: {
      type: String,
      enum: ['checked_in', 'meeting_in_progress', 'completed', 'cancelled'],
      default: 'checked_in',
    },

    checkInTime: { type: Date, default: Date.now },
    checkOutTime: { type: Date, default: null },
  },
  { timestamps: true }
);

visitSchema.index({ createdAt: -1 });
visitSchema.index({ mobile: 1 });
visitSchema.index({ email: 1 });

module.exports = mongoose.model('Visit', visitSchema);
