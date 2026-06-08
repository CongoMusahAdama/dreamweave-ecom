import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { NEW_ARRIVALS_HASH, NEW_ARRIVALS_SECTION_ID } from '@/lib/scroll-to';
import { HEADER_OFFSET_SCROLL_MT } from '@/lib/page-layout';
import { useShopCatalog } from '@/contexts/ShopCatalogContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { sortShopProductsNewestFirst } from '@/lib/shop-catalog';
import { buildFeaturedCategoryTabs } from '@/lib/categories';
import ProductCard from '@/components/shop/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

const DISPLAY_LIMIT = 16;

const FeaturedProducts = () => {
  const { products: shopProducts } = useShopCatalog();
  const { categories: shopCategories } = useCategories();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('new-arrivals');

  useEffect(() => {
    if (location.hash === NEW_ARRIVALS_HASH) {
      setSelectedCategory('new-arrivals');
    }
  }, [location.hash]);

  const categories = buildFeaturedCategoryTabs(shopCategories);

  const filteredProducts = useMemo(() => {
    const sorted = sortShopProductsNewestFirst(shopProducts);
    if (selectedCategory === 'all' || selectedCategory === 'new-arrivals') {
      return sorted.slice(0, DISPLAY_LIMIT);
    }
    return sorted.filter((p) => p.category === selectedCategory).slice(0, DISPLAY_LIMIT);
  }, [selectedCategory, shopProducts]);

  return (
    <section
      id={NEW_ARRIVALS_SECTION_ID}
      className={cn(
        'py-12 sm:py-16 md:py-24 bg-white border-t border-black/10 overflow-x-hidden',
        HEADER_OFFSET_SCROLL_MT
      )}
    >
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8">
        <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 border-b border-black/10 pb-5 sm:pb-6">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">
            Latest drops
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-10 -mx-1 px-1 overflow-x-auto scrollbar-none">
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                onClick={() => setSelectedCategory(category.key)}
                className={cn(
                  'text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 py-2 shrink-0',
                  selectedCategory === category.key
                    ? 'text-black border-b border-black'
                    : 'text-black/40 hover:text-black'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 md:gap-x-8 gap-y-8 sm:gap-y-10 md:gap-y-14">
          {filteredProducts.map((product, index) => (
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
