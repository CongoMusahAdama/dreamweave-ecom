const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  caption: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  category: {
    type: String,
    enum: ['lifestyle', 'hoodies', 'tees', 'jerseys', 'caps', 'accessories'],
    default: 'lifestyle',
    lowercase: true,
  },
  image: {
    type: String,
    required: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
