const Category = require('../models/Category');

const DEFAULT_CATEGORIES = [
  { slug: 'hoodies', label: 'Hoodies', sortOrder: 1 },
  { slug: 'tees', label: 'Tees', sortOrder: 2 },
  { slug: 'longsleeves', label: 'Long Sleeves', sortOrder: 3 },
  { slug: 'bottoms', label: 'Bottoms', sortOrder: 4 },
  { slug: 'jerseys', label: 'Jerseys', sortOrder: 5 },
  { slug: 'caps', label: 'Caps', sortOrder: 6 },
  { slug: 'accessories', label: 'Accessories', sortOrder: 7 },
];

function slugifyCategory(label) {
  return String(label)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function labelFromSlug(slug) {
  return String(slug)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function ensureDefaultCategories() {
  for (const item of DEFAULT_CATEGORIES) {
    await Category.findOneAndUpdate(
      { slug: item.slug },
      { $setOnInsert: { ...item, isActive: true } },
      { upsert: true, new: true }
    );
  }
}

async function isValidCategorySlug(slug) {
  if (!slug) return false;
  const doc = await Category.findOne({ slug: slug.toLowerCase(), isActive: true });
  return Boolean(doc);
}

async function listActiveCategories() {
  return Category.find({ isActive: true }).sort({ sortOrder: 1, label: 1 });
}

module.exports = {
  DEFAULT_CATEGORIES,
  slugifyCategory,
  labelFromSlug,
  ensureDefaultCategories,
  isValidCategorySlug,
  listActiveCategories,
};
