/** Must match backend Product schema size enum */
export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];

export const DEFAULT_PRODUCT_SIZES: ProductSize[] = ['S', 'M', 'L', 'XL'];
