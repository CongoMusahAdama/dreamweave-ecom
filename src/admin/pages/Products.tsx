import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminPanel from '../components/ui/AdminPanel';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { apiFormFetch, ADMIN_INPUT, ADMIN_LABEL, ADMIN_BTN, ADMIN_BTN_OUTLINE } from '../lib/apiForm';
import type { MongoProduct } from '../types/admin';
import { formatGhs } from '../lib/format';
import { cn } from '@/lib/utils';

const CATEGORIES = ['hoodies', 'tees', 'jerseys', 'caps', 'accessories'] as const;
const FILTER_CATS = ['all', ...CATEGORIES] as const;

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'tees',
  stock: '0',
};

const Products = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<MongoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (category !== 'all') params.set('category', category);
      if (search.trim()) params.set('search', search.trim());

      const res = await apiFetch<{
        success: boolean;
        data: { products: MongoProduct[]; pagination: { total: number } };
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !imageFile) {
      setError('Name, description, price, category, stock, and image are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('description', form.description.trim());
      fd.append('price', form.price);
      fd.append('category', form.category);
      fd.append('stock', form.stock);
      fd.append('image', imageFile);

      await apiFormFetch('/api/products', fd, { token });
      setForm(emptyForm);
      setImageFile(null);
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!token || !window.confirm(`Remove "${name}" from catalog?`)) return;
    try {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE', token });
      loadProducts();
    } catch {
      /* ignore */
    }
  };

  return (
    <AdminLayout productCount={total}>
      <AdminPageHeader
        title="Product catalog"
        description="Add and remove products for the store — name, photo, price, stock."
      >
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className={ADMIN_BTN_OUTLINE}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          {showForm ? 'Cancel' : 'Add product'}
        </button>
      </AdminPageHeader>

      {showForm && (
        <AdminPanel title="New product" >
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            {error && (
              <p className="text-[9px] font-bold uppercase text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                {error}
              </p>
            )}
            <label className="block">
              <span className={ADMIN_LABEL}>Name *</span>
              <input
                className={ADMIN_INPUT}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </label>
            <label className="block">
              <span className={ADMIN_LABEL}>Description *</span>
              <textarea
                className={`${ADMIN_INPUT} min-h-[80px] resize-y normal-case`}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                minLength={10}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={ADMIN_LABEL}>Price (GHS) *</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={ADMIN_INPUT}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  required
                />
              </label>
              <label className="block">
                <span className={ADMIN_LABEL}>Stock *</span>
                <input
                  type="number"
                  min="0"
                  className={ADMIN_INPUT}
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  required
                />
              </label>
            </div>
            <label className="block">
              <span className={ADMIN_LABEL}>Category *</span>
              <select
                className={ADMIN_INPUT}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={ADMIN_LABEL}>Product image *</span>
              <input
                type="file"
                accept="image/*"
                className="text-[10px] font-bold uppercase w-full min-h-[48px]"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                required
              />
            </label>
            <button type="submit" disabled={saving} className={ADMIN_BTN}>
              {saving ? 'Saving…' : 'Save product'}
            </button>
          </form>
        </AdminPanel>
      )}

      <div className="mb-4 space-y-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className={ADMIN_INPUT}
        />
        <div className="flex flex-wrap gap-2">
          {FILTER_CATS.map((c) => (
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
          <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse">Loading…</p>
        </div>
      ) : products.length === 0 ? (
        <div className="border border-dashed border-black/20 p-8 text-center">
          <p className="text-[11px] font-bold uppercase text-black/50">No products yet</p>
          <p className="text-[10px] font-bold text-black/40 mt-2 uppercase">Tap Add product above</p>
        </div>
      ) : (
        <ul className="border border-black/10 divide-y divide-black/10 bg-white">
          {products.map((product) => {
            const img = product.images?.front;
            return (
              <li
                key={product._id}
                className="flex gap-3 p-4 sm:p-5 items-center"
              >
                {img ? (
                  <img
                    src={img}
                    alt=""
                    className="h-16 w-16 object-cover border border-black/10 shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 border border-black/10 bg-black/5 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-black line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-[9px] font-bold text-black/40 mt-1 uppercase">
                    {product.category} · {formatGhs(product.price)} · {product.stock} in stock
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(product._id, product.name)}
                  className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center text-red-600 hover:text-red-700 border border-black/10"
                  aria-label="Delete product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </AdminLayout>
  );
};

export default Products;
