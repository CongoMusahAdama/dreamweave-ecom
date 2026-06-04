import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import type { MongoProduct } from '../types/admin';
import { formatGhs } from '../lib/format';
import { cn } from '@/lib/utils';

const CATEGORIES = ['all', 'hoodies', 'tees', 'jerseys', 'caps', 'accessories'] as const;

const Products = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<MongoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [total, setTotal] = useState(0);

  const loadProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (category !== 'all') params.set('category', category);
      if (search.trim()) params.set('search', search.trim());

      const res = await apiFetch<{
        success: boolean;
        data: {
          products: MongoProduct[];
          pagination: { total: number };
        };
      }>(`/api/admin/products?${params}`, { token });

      setProducts(res.data.products);
      setTotal(res.data.pagination.total);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [token, category, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const stockLabel = (stock: number) => {
    if (stock === 0) return { text: 'Out of stock', className: 'text-red-700' };
    if (stock <= 5) return { text: `Low (${stock})`, className: 'text-amber-800' };
    return { text: `In stock (${stock})`, className: 'text-black/50' };
  };

  return (
    <AdminLayout productCount={total}>
      <AdminPageHeader
        title="Products"
        description="MongoDB catalog. Storefront may still use static listings until fully synced."
      />

      <div className="mb-4 space-y-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full border border-black/20 bg-white px-4 py-3 min-h-[48px] text-[10px] font-bold uppercase tracking-wider placeholder:text-black/30"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                'px-3 py-2 min-h-[40px] text-[9px] font-bold tracking-[0.12em] uppercase border transition-colors',
                category === c
                  ? 'bg-black text-white border-black'
                  : 'text-black/50 border-black/15 hover:border-black/30'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center border border-black/10">
          <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse">
            Loading products…
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="border border-dashed border-black/20 p-8 sm:p-12 text-center">
          <p className="text-[11px] font-bold uppercase text-black/50">No products in database</p>
          <p className="text-[10px] font-bold text-black/40 mt-2 uppercase tracking-wider">
            Add products via POST /api/products (admin)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {products.map((product) => {
            const stock = stockLabel(product.stock);
            const img = product.images?.front;

            return (
              <article
                key={product._id}
                className="border border-black/10 flex gap-3 p-3 sm:p-4 bg-white"
              >
                {img ? (
                  <img
                    src={img}
                    alt=""
                    className="h-16 w-16 sm:h-20 sm:w-20 object-cover border border-black/10 shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 sm:h-20 sm:w-20 border border-black/10 bg-black/5 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-black line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-[9px] font-bold text-black/40 mt-1 uppercase">
                    {product.category}
                    {product.isActive === false && ' · Hidden'}
                  </p>
                  <p className="text-[11px] font-bold tabular-nums mt-2">{formatGhs(product.price)}</p>
                  <p className={cn('text-[9px] font-bold uppercase mt-1', stock.className)}>
                    {stock.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default Products;
