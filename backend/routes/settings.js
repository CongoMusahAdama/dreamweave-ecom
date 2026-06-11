const express = require('express');
const { body, validationResult } = require('express-validator');
const SiteSettings = require('../models/SiteSettings');
const { DEFAULT_ABOUT_PARAGRAPHS } = require('../models/SiteSettings');
const { protect, authorize } = require('../middleware/auth');
const { uploadSettingsImages } = require('../middleware/upload');
const { normalizeStoredImageUrl } = require('../lib/imageUrls');
const { resolveUploadedImageUrl } = require('../lib/uploadImage');
const { deleteCloudinaryUrl } = require('../lib/cloudinaryAssets');

const router = express.Router();

function parseAboutBody(body) {
  if (body === undefined) return undefined;
  return String(body)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function serializeSettings(doc) {
  const raw = doc.toObject ? doc.toObject() : doc;
  const paragraphs =
    Array.isArray(raw.aboutParagraphs) && raw.aboutParagraphs.length > 0
      ? raw.aboutParagraphs.map((p) => String(p).trim()).filter(Boolean)
      : [...DEFAULT_ABOUT_PARAGRAPHS];

  return {
    logoUrl: raw.logoUrl ? normalizeStoredImageUrl(raw.logoUrl) : '',
    logoAlt: raw.logoAlt || 'HARV DREAMS',
    storeName: raw.storeName || 'HARV DREAMS',
    storeEmail: raw.storeEmail || '',
    storePhone: raw.storePhone || '',
    storeCity: raw.storeCity || '',
    heroImageUrl: raw.heroImageUrl
      ? normalizeStoredImageUrl(raw.heroImageUrl)
      : '/lovable-uploads/cover.JPG.jpeg',
    heroImageAlt: raw.heroImageAlt || 'HARV DREAMS campaign',
    aboutEyebrow: raw.aboutEyebrow || 'Our story',
    aboutTitle: raw.aboutTitle || 'About HARV DREAMS',
    aboutParagraphs: paragraphs,
  };
}

// @desc    Public site settings (logo, store info, homepage & about content)
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
router.put('/', protect, authorize('admin'), uploadSettingsImages, [
  body('logoAlt').optional().trim().isLength({ max: 80 }),
  body('storeName').optional().trim().isLength({ max: 100 }),
  body('storeEmail').optional().trim().isLength({ max: 120 }),
  body('storePhone').optional().trim().isLength({ max: 40 }),
  body('storeCity').optional().trim().isLength({ max: 80 }),
  body('heroImageAlt').optional().trim().isLength({ max: 120 }),
  body('aboutEyebrow').optional().trim().isLength({ max: 80 }),
  body('aboutTitle').optional().trim().isLength({ max: 120 }),
  body('aboutBody').optional().trim().isLength({ max: 5000 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const settings = await SiteSettings.getSingleton();
    const {
      logoAlt,
      storeName,
      storeEmail,
      storePhone,
      storeCity,
      heroImageAlt,
      aboutEyebrow,
      aboutTitle,
      aboutBody,
    } = req.body;

    if (logoAlt !== undefined) settings.logoAlt = logoAlt.trim() || 'HARV DREAMS';
    if (storeName !== undefined) settings.storeName = storeName.trim() || 'HARV DREAMS';
    if (storeEmail !== undefined) settings.storeEmail = storeEmail.trim();
    if (storePhone !== undefined) settings.storePhone = storePhone.trim();
    if (storeCity !== undefined) settings.storeCity = storeCity.trim();
    if (heroImageAlt !== undefined) settings.heroImageAlt = heroImageAlt.trim() || 'HARV DREAMS campaign';
    if (aboutEyebrow !== undefined) settings.aboutEyebrow = aboutEyebrow.trim() || 'Our story';
    if (aboutTitle !== undefined) settings.aboutTitle = aboutTitle.trim() || 'About HARV DREAMS';

    const parsedAbout = parseAboutBody(aboutBody);
    if (parsedAbout !== undefined) {
      settings.aboutParagraphs = parsedAbout.length > 0 ? parsedAbout : [...DEFAULT_ABOUT_PARAGRAPHS];
    }

    const logoFile = req.files?.image?.[0];
    const heroFile = req.files?.heroImage?.[0];

    if (logoFile) {
      const newLogoUrl = await resolveUploadedImageUrl(logoFile, 'brand');
      if (settings.logoUrl && settings.logoUrl !== newLogoUrl) {
        await deleteCloudinaryUrl(settings.logoUrl);
      }
      settings.logoUrl = newLogoUrl;
    }

    if (heroFile) {
      const newHeroUrl = await resolveUploadedImageUrl(heroFile, 'site');
      if (settings.heroImageUrl && settings.heroImageUrl !== newHeroUrl) {
        await deleteCloudinaryUrl(settings.heroImageUrl);
      }
      settings.heroImageUrl = newHeroUrl;
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
