const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Host name is required'], trim: true },
    designation: { type: String, trim: true },
    department: { type: String, trim: true },
  },
  { timestamps: true }
);

hostSchema.virtual('initials').get(function getInitials() {
  return this.name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
});

hostSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Host', hostSchema);
