import type { ShopProduct } from '@/data/products';

/** Unique gallery URLs: front, back, then extra views (admin uploads) */
export function getProductGalleryImages(
  product: Pick<ShopProduct, 'frontImage' | 'backImage' | 'images'>
): string[] {
  const ordered = [
    product.frontImage,
    product.backImage,
    ...(product.images || []),
  ].filter((url): url is string => Boolean(url?.trim()));

  return [...new Set(ordered)];
}

export function galleryImageLabel(index: number, total: number): string {
  if (total <= 1) return 'View';
  if (index === 0) return 'Front';
  if (index === 1) return 'Back';
  return `View ${index + 1}`;
}
