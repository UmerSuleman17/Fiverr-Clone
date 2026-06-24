const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    metric: { type: String }, // e.g., 'revenue', 'orders'
    value: { type: Number },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AnalyticsSchema.index({ user: 1, metric: 1, date: 1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);