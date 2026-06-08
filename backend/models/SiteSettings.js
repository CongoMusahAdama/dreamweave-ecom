const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, default: '' },
    logoAlt: { type: String, default: 'HARV DREAMS' },
    storeName: { type: String, default: 'HARV DREAMS' },
    storeEmail: { type: String, default: '' },
    storePhone: { type: String, default: '' },
    storeCity: { type: String, default: '' },
  },
  { timestamps: true }
);

siteSettingsSchema.statics.getSingleton = async function getSingleton() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
