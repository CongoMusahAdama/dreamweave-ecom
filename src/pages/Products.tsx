import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ShopHeader from '@/components/navigation/ShopHeader';
import ProductCard from '@/components/shop/ProductCard';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/scroll-to-top';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useShopCatalog } from '@/contexts/ShopCatalogContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { sortShopProductsNewestFirst } from '@/lib/shop-catalog';
import { SHOP_HEADER_OFFSET_PT, PAGE_X } from '@/lib/page-layout';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const Products = () => {
  const { products: shopProducts, loading: catalogLoading } = useShopCatalog();
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const { cartCount } = useCart();

  useEffect(() => {
    const validKeys = new Set(['all', ...categories.map((c) => c.slug)]);
    if (validKeys.has(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam, categories]);

  const filteredProducts = useMemo(() => {
    const matched = shopProducts.filter((product) => {
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
      const searchMatch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });

    if (searchQuery) return matched;

    return sortShopProductsNewestFirst(matched);
  }, [shopProducts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <ShopHeader cartCount={cartCount} />

      <main className={`bg-white w-full ${SHOP_HEADER_OFFSET_PT}`}>
        <section className="py-4 sm:py-10 md:py-12 lg:py-16">
          <div className={cn('w-full max-w-[1600px] mx-auto', PAGE_X)}>
            <ScrollReveal variant="fade-up" className="mb-8 md:mb-12 text-center md:text-left">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-2">
                Shop
              </p>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-[0.08em] uppercase text-black">
                All drops
              </h1>
            </ScrollReveal>

            {catalogLoading ? (
              <p className="text-center py-16 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 animate-pulse">
                Loading collection…
              </p>
            ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-12 lg:gap-x-16 gap-y-10 sm:gap-y-14 md:gap-y-20 lg:gap-y-24">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
            )}

            {!catalogLoading && filteredProducts.length === 0 && (
              <ScrollReveal variant="fade" className="text-center py-16">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">
                  No products found
                </p>
              </ScrollReveal>
            )}
          </div>
        </section>
      </main>

      <WhatsAppButton />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Products;
