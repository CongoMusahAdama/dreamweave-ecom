import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { ShopProduct } from '@/data/products';
import { useShopCatalog } from '@/contexts/ShopCatalogContext';
import ProductCard from '@/components/shop/ProductCard';

const RELATED_LIMIT = 4;

function createdTime(p: ShopProduct) {
  return p.createdAt ? new Date(p.createdAt).getTime() : 0;
}

/**
 * Rank other products by how likely a shopper of `current` is to want them:
 * same category first, then similar price, then newest. Sold-out items go last.
 */
function pickRelatedProducts(current: ShopProduct, all: ShopProduct[], limit = RELATED_LIMIT) {
  const basePrice = current.priceAmount || 1;

  return all
    .filter((p) => p.id !== current.id)
    .map((p) => {
      const sameCategory = p.category === current.category ? 1 : 0;
      const priceGap = Math.abs((p.priceAmount || 0) - basePrice) / basePrice;
      const priceScore = Math.max(0, 1 - priceGap); // 1 = same price, 0 = 2x away or more
      const inStock = p.stock === 0 ? 0 : 1;
      return { p, score: inStock * 10 + sameCategory * 5 + priceScore * 2 };
    })
    .sort((a, b) => b.score - a.score || createdTime(b.p) - createdTime(a.p))
    .slice(0, limit)
    .map((entry) => entry.p);
}

const RelatedProducts = ({ product }: { product: ShopProduct }) => {
  const { products } = useShopCatalog();
  const related = useMemo(() => pickRelatedProducts(product, products), [product, products]);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 lg:mt-16 pt-8 border-t border-black/10" aria-labelledby="related-heading">
      <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
        <h2
          id="related-heading"
          className="text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase text-black"
        >
          You may also like
        </h2>
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="text-[9px] font-bold tracking-[0.15em] uppercase text-black/50 hover:text-black shrink-0"
        >
          See more →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-8">
        {related.map((p, index) => (
          <ProductCard key={p.id} product={p} index={index + 4} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
