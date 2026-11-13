import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { NEW_ARRIVALS_SECTION_ID } from '@/lib/scroll-to';
import { HEADER_OFFSET_SCROLL_MT } from '@/lib/page-layout';
import { useShopCatalog } from '@/contexts/ShopCatalogContext';
import { sortShopProductsNewestFirst } from '@/lib/shop-catalog';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

const DISPLAY_LIMIT = 16;

/** Homepage grid of the newest products — category browsing lives in the header menu. */
const FeaturedProducts = () => {
  const { products: shopProducts } = useShopCatalog();

  const newestProducts = useMemo(
    () => sortShopProductsNewestFirst(shopProducts).slice(0, DISPLAY_LIMIT),
    [shopProducts]
  );

  return (
    <section
      id={NEW_ARRIVALS_SECTION_ID}
      className={cn(
        'py-12 sm:py-16 md:py-24 bg-white border-t border-black/10 overflow-x-hidden',
        HEADER_OFFSET_SCROLL_MT
      )}
    >
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 md:gap-x-8 gap-y-8 sm:gap-y-10 md:gap-y-14">
          {newestProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <ScrollReveal variant="fade-up" delay={200} className="mt-10 sm:mt-14 text-center">
          <Link to="/products">
            <button type="button" className="btn-premium w-full sm:w-auto">
              View All
            </button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FeaturedProducts;
