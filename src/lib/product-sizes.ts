/** Must match backend Product schema size enum */
export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'One Size'] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];

export const DEFAULT_PRODUCT_SIZES: ProductSize[] = ['S', 'M', 'L', 'XL'];
