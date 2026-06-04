import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getCategoryLabel, type ShopProduct } from '@/data/products';
import { getProductGalleryImages } from '@/lib/product-images';
import ScrollReveal from '@/components/ui/ScrollReveal';
import WishlistButton from '@/components/shop/WishlistButton';

interface ProductCardProps {
  product: ShopProduct;
  index?: number;
  className?: string;
}

const ProductCard = ({ product, index = 0, className }: ProductCardProps) => {
  const isSoldOut = product.stock === 0;
  const staggerDelay = Math.min(index * 70, 560);
  const gallery = getProductGalleryImages(product);
  const frontImage = gallery[0];
  const backImage = gallery.length > 1 ? gallery[1] : null;
  const hasBackView = Boolean(backImage && backImage !== frontImage);

  return (
    <article className="w-full">
      <ScrollReveal
        variant="product"
        delay={staggerDelay}
        className={cn('flex flex-col items-center text-center w-full', className)}
      >
        <Link
          to={isSoldOut ? '#' : `/products/${product.id}`}
          className={cn(
            'w-full flex flex-col items-center group touch-manipulation',
            isSoldOut && 'pointer-events-none'
          )}
          onClick={(e) => isSoldOut && e.preventDefault()}
        >
          <div className="relative w-full aspect-square bg-white mb-3 md:mb-4 flex items-center justify-center overflow-hidden rounded-sm group/card">
            {!isSoldOut && (
              <div className="absolute top-2 right-2 z-10 pointer-events-auto">
                <WishlistButton productId={product.id} size="sm" />
              </div>
            )}
            <img
              src={frontImage}
              alt={product.name}
              className={cn(
                'max-h-full max-w-full w-full h-full object-contain p-2 md:p-3 transition-all duration-500 ease-out',
                hasBackView && !isSoldOut && 'group-hover/card:opacity-0 group-hover/card:scale-105'
              )}
              loading="lazy"
            />
            {hasBackView && !isSoldOut && (
              <img
                src={backImage!}
                alt=""
                className="absolute inset-0 max-h-full max-w-full m-auto object-contain p-2 md:p-3 opacity-0 transition-all duration-500 ease-out group-hover/card:opacity-100 group-hover/card:scale-105"
                loading="lazy"
              />
            )}

            {!isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-black bg-white/95 px-3 py-2 border border-black/10 translate-y-1 group-hover/card:translate-y-0 transition-transform duration-300">
                  View details
                </span>
              </div>
            )}

            {isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-white/80">
                <span className="bg-black text-white text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-3 min-w-[90px] text-center leading-tight">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        </Link>

        <Link
          to={isSoldOut ? '#' : `/products/${product.id}`}
          className={cn('w-full touch-manipulation', isSoldOut && 'pointer-events-none')}
          onClick={(e) => isSoldOut && e.preventDefault()}
        >
          <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-black/40 mb-1">
            {getCategoryLabel(product.category)}
          </p>
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-1 md:mb-1.5 w-full group-hover:opacity-60 transition-opacity leading-snug px-1">
            {product.name}
          </h3>
          <p className="text-[12px] md:text-[13px] font-bold text-black">{product.price}</p>
        </Link>
      </ScrollReveal>
    </article>
  );
};

export default ProductCard;
