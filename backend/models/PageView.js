const mongoose = require('mongoose');

/** Raw visits older than this are removed automatically (keeps the free Mongo tier lean). */
const RETENTION_DAYS = 400;

const pageViewSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, maxlength: 64 },
    sessionId: { type: String, required: true, maxlength: 64 },
    path: { type: String, required: true, maxlength: 300 },
    referrerHost: { type: String, maxlength: 200, default: '' },
    country: { type: String, maxlength: 2, default: '' },
    region: { type: String, maxlength: 80, default: '' },
    city: { type: String, maxlength: 120, default: '' },
    device: { type: String, enum: ['mobile', 'tablet', 'desktop'], default: 'desktop' },
    browser: { type: String, maxlength: 40, default: 'Other' },
    os: { type: String, maxlength: 40, default: 'Other' },
    /** True on the very first page a browser ever loads — used for new vs returning visitors. */
    firstVisit: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

pageViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: RETENTION_DAYS * 24 * 60 * 60 });
pageViewSchema.index({ createdAt: 1, visitorId: 1 });

module.exports = mongoose.model('PageView', pageViewSchema);
