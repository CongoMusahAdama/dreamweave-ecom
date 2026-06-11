const mongoose = require('mongoose');

const DEFAULT_ABOUT_PARAGRAPHS = [
  'HARV DREAMS is a brand built for dreamers who refuse to quit.',
  'We create bold, purpose-driven pieces that represent courage, resilience, and the pursuit of dreams that others call impossible.',
  'Every collection is a reminder to keep pushing, keep believing, and keep living your vision!',
];

const siteSettingsSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, default: '' },
    logoAlt: { type: String, default: 'HARV DREAMS' },
    storeName: { type: String, default: 'HARV DREAMS' },
    storeEmail: { type: String, default: '' },
    storePhone: { type: String, default: '' },
    storeCity: { type: String, default: '' },
    heroImageUrl: { type: String, default: '/lovable-uploads/cover.JPG.jpeg' },
    heroImageAlt: { type: String, default: 'HARV DREAMS campaign' },
    aboutEyebrow: { type: String, default: 'Our story' },
    aboutTitle: { type: String, default: 'About HARV DREAMS' },
    aboutParagraphs: {
      type: [String],
      default: () => [...DEFAULT_ABOUT_PARAGRAPHS],
    },
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
module.exports.DEFAULT_ABOUT_PARAGRAPHS = DEFAULT_ABOUT_PARAGRAPHS;
