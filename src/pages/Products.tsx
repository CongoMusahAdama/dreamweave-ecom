import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ShopHeader from '@/components/navigation/ShopHeader';
import ProductCard from '@/components/shop/ProductCard';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/scroll-to-top';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { shopProducts } from '@/data/products';
import { SHOP_HEADER_OFFSET_PT, PAGE_X } from '@/lib/page-layout';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const { cartCount } = useCart();

  useEffect(() => {
    const validKeys = ['all', 'hoodies', 'tees', 'longsleeves', 'bottoms', 'jerseys', 'caps', 'accessories'];
    if (validKeys.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredProducts = (() => {
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

    return [...matched].sort((a, b) => b.id - a.id).slice(0, 16);
  })();

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

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-12 lg:gap-x-16 gap-y-10 sm:gap-y-14 md:gap-y-20 lg:gap-y-24">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
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
