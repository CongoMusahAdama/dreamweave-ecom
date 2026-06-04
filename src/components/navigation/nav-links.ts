import { NEW_ARRIVALS_HASH } from '@/lib/scroll-to';

export const shopLinks = [
  { label: 'NEW ARRIVALS', path: `/${NEW_ARRIVALS_HASH}` },
  { label: 'HOODIES', path: '/products?category=hoodies' },
  { label: 'TEES', path: '/products?category=tees' },
  { label: 'LONG SLEEVES', path: '/products?category=longsleeves' },
  { label: 'BOTTOMS', path: '/products?category=bottoms' },
  { label: 'JERSEYS', path: '/products?category=jerseys' },
  { label: 'CAPS', path: '/products?category=caps' },
  { label: 'ACCESSORIES', path: '/products?category=accessories' },
  { label: 'ALL PRODUCTS', path: '/products?category=all' },
];

export const pageLinks = [
  { label: 'GALLERY', path: '/gallery' },
  { label: 'ABOUT', path: '/about' },
];

export const shopCategories = [
  { key: 'all', label: 'ALL', path: '/products?category=all' },
  { key: 'hoodies', label: 'HOODIES', path: '/products?category=hoodies' },
  { key: 'tees', label: 'TEES', path: '/products?category=tees' },
  { key: 'longsleeves', label: 'LONG SLEEVES', path: '/products?category=longsleeves' },
  { key: 'bottoms', label: 'BOTTOMS', path: '/products?category=bottoms' },
  { key: 'jerseys', label: 'JERSEYS', path: '/products?category=jerseys' },
  { key: 'caps', label: 'CAPS', path: '/products?category=caps' },
  { key: 'accessories', label: 'ACCESSORIES', path: '/products?category=accessories' },
];
