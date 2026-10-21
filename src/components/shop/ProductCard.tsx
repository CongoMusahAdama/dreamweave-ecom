import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { ShopProduct } from '@/data/products';
import { useCategories } from '@/contexts/CategoriesContext';
import { getProductGalleryImages } from '@/lib/product-images';
import ScrollReveal from '@/components/ui/ScrollReveal';
import WishlistButton from '@/components/shop/WishlistButton';

interface ProductCardProps {
  product: ShopProduct;
  index?: number;
  className?: string;
}

const ProductCard = ({ product, index = 0, className }: ProductCardProps) => {
  const { getLabel: getCategoryLabel } = useCategories();
  const isSoldOut = product.stock === 0;
  const staggerDelay = 0;
  const gallery = getProductGalleryImages(product);
  const frontImage = gallery[0]?.url;
  const backImage = gallery.length > 1 ? gallery[1]?.url : null;
  const hasBackView = Boolean(backImage && backImage !== frontImage);
  const shouldPrioritizeImage = index < 4;

  return (
    <article className="w-full">
      <ScrollReveal
        variant="product"
        delay={staggerDelay}
        className={cn('flex flex-col items-center text-center w-full', className)}
      >
        <Link
          to={`/products/${product.id}`}
          className="w-full flex flex-col items-center group touch-manipulation"
        >
          <div className="relative w-full aspect-square bg-white mb-3 md:mb-4 flex items-center justify-center overflow-hidden rounded-sm group/card">
            <div className="absolute top-2 right-2 z-10 pointer-events-auto">
              <WishlistButton productId={product.id} size="sm" />
            </div>
            <img
              src={frontImage}
              alt={product.name}
              className={cn(
                'max-h-full max-w-full w-full h-full object-contain p-2 md:p-3 transition-all duration-500 ease-out',
                hasBackView && 'group-hover/card:opacity-0 group-hover/card:scale-105'
              )}
              loading={shouldPrioritizeImage ? 'eager' : 'lazy'}
              fetchPriority={shouldPrioritizeImage ? 'high' : 'auto'}
              decoding="async"
            />
            {hasBackView && (
              <img
                src={backImage!}
                alt=""
                className="absolute inset-0 max-h-full max-w-full m-auto object-contain p-2 md:p-3 opacity-0 transition-all duration-500 ease-out group-hover/card:opacity-100 group-hover/card:scale-105"
                loading="lazy"
                decoding="async"
              />
            )}

            {isSoldOut && (
              <span className="absolute top-2 left-2 z-20 pointer-events-none bg-black text-white text-[8px] md:text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1.5 leading-none">
                Sold Out
              </span>
            )}
          </div>
        </Link>

        <Link to={`/products/${product.id}`} className="w-full touch-manipulation">
          <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-black/40 mb-1">
            {getCategoryLabel(product.category)}
          </p>
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-1 md:mb-1.5 w-full group-hover:opacity-60 transition-opacity leading-snug px-1">
            {product.name}
          </h3>
          <p className="text-[12px] md:text-[13px] font-bold text-black">
            {product.price}
            {isSoldOut && <span className="ml-1.5 text-black/40">· Sold out</span>}
          </p>
        </Link>
      </ScrollReveal>
    </article>
  );
};

export default ProductCard;
