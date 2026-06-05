const express = require('express');
const path = require('path');
const { body, validationResult } = require('express-validator');
const GalleryItem = require('../models/GalleryItem');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingleImage, uploadToCloudinary } = require('../middleware/upload');
const { publicApiBase, normalizeStoredImageUrl } = require('../lib/imageUrls');

const router = express.Router();

async function resolveImageUrl(file) {
  if (!file) return '';
  try {
    const result = await uploadToCloudinary(file.path, 'gallery');
    if (result?.secure_url) return result.secure_url;
  } catch (err) {
    console.error('Gallery Cloudinary upload failed, using local path:', err.message);
  }
  return `${publicApiBase()}/uploads/${path.basename(file.path)}`;
}

// @desc    List gallery images (public)
// @route   GET /api/gallery
router.get('/', async (req, res) => {
  try {
    const items = await GalleryItem.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: {
        items: items.map((item) => {
          const doc = item.toObject ? item.toObject() : item;
          if (doc.image) doc.image = normalizeStoredImageUrl(doc.image);
          return doc;
        }),
      },
    });
  } catch (error) {
    console.error('Gallery list error:', error);
    res.status(500).json({ success: false, message: 'Error fetching gallery' });
  }
});

// @desc    Add gallery image (admin)
// @route   POST /api/gallery
router.post('/', protect, authorize('admin'), uploadSingleImage, [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('caption').optional().trim().isLength({ max: 300 }),
  body('category').optional().isIn(['lifestyle', 'hoodies', 'tees', 'jerseys', 'caps', 'accessories']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const imageUrl = await resolveImageUrl(req.file);
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const item = await GalleryItem.create({
      name: req.body.name.trim(),
      caption: req.body.caption?.trim() || '',
      category: (req.body.category || 'lifestyle').toLowerCase(),
      image: imageUrl,
    });

    res.status(201).json({ success: true, data: { item } });
  } catch (error) {
    console.error('Gallery create error:', error);
    res.status(500).json({ success: false, message: 'Error adding gallery image' });
  }
});

// @desc    Delete gallery image (admin)
// @route   DELETE /api/gallery/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.status(200).json({ success: true, message: 'Gallery image removed' });
  } catch (error) {
    console.error('Gallery delete error:', error);
    res.status(500).json({ success: false, message: 'Error deleting gallery image' });
  }
});

module.exports = router;
