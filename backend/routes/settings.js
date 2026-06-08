const express = require('express');
const { body, validationResult } = require('express-validator');
const SiteSettings = require('../models/SiteSettings');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingleImage } = require('../middleware/upload');
const { normalizeStoredImageUrl } = require('../lib/imageUrls');
const { resolveUploadedImageUrl } = require('../lib/uploadImage');
const { deleteCloudinaryUrl } = require('../lib/cloudinaryAssets');

const router = express.Router();

function serializeSettings(doc) {
  const raw = doc.toObject ? doc.toObject() : doc;
  return {
    logoUrl: raw.logoUrl ? normalizeStoredImageUrl(raw.logoUrl) : '',
    logoAlt: raw.logoAlt || 'HARV DREAMS',
    storeName: raw.storeName || 'HARV DREAMS',
    storeEmail: raw.storeEmail || '',
    storePhone: raw.storePhone || '',
    storeCity: raw.storeCity || '',
  };
}

// @desc    Public site settings (logo, store info)
// @route   GET /api/settings
router.get('/', async (_req, res) => {
  try {
    const settings = await SiteSettings.getSingleton();
    res.status(200).json({
      success: true,
      data: { settings: serializeSettings(settings) },
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ success: false, message: 'Error fetching settings' });
  }
});

// @desc    Update site settings (admin)
// @route   PUT /api/settings
router.put('/', protect, authorize('admin'), uploadSingleImage, [
  body('logoAlt').optional().trim().isLength({ max: 80 }),
  body('storeName').optional().trim().isLength({ max: 100 }),
  body('storeEmail').optional().trim().isLength({ max: 120 }),
  body('storePhone').optional().trim().isLength({ max: 40 }),
  body('storeCity').optional().trim().isLength({ max: 80 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const settings = await SiteSettings.getSingleton();
    const { logoAlt, storeName, storeEmail, storePhone, storeCity } = req.body;

    if (logoAlt !== undefined) settings.logoAlt = logoAlt.trim() || 'HARV DREAMS';
    if (storeName !== undefined) settings.storeName = storeName.trim() || 'HARV DREAMS';
    if (storeEmail !== undefined) settings.storeEmail = storeEmail.trim();
    if (storePhone !== undefined) settings.storePhone = storePhone.trim();
    if (storeCity !== undefined) settings.storeCity = storeCity.trim();

    if (req.file) {
      const newLogoUrl = await resolveUploadedImageUrl(req.file, 'brand');
      if (settings.logoUrl && settings.logoUrl !== newLogoUrl) {
        await deleteCloudinaryUrl(settings.logoUrl);
      }
      settings.logoUrl = newLogoUrl;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings saved',
      data: { settings: serializeSettings(settings) },
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ success: false, message: 'Error saving settings' });
  }
});

module.exports = router;
