import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiFetch } from '@/lib/api';
import type { ShopCategory } from '@/lib/categories';

type CategoriesContextValue = {
  categories: ShopCategory[];
  loading: boolean;
  refresh: () => Promise<void>;
  getLabel: (slug: string) => string;
};

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        data: { categories: ShopCategory[] };
      }>('/api/categories');
      setCategories(res.data.categories || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onChange = () => {
      void refresh();
    };
    window.addEventListener('harv:categories-changed', onChange);
    return () => window.removeEventListener('harv:categories-changed', onChange);
  }, [refresh]);

  const getLabel = useCallback(
    (slug: string) => {
      const match = categories.find((c) => c.slug === slug);
      return match?.label ?? slug;
    },
    [categories]
  );

  const value = useMemo(
    () => ({ categories, loading, refresh, getLabel }),
    [categories, loading, refresh, getLabel]
  );

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error('useCategories must be used within CategoriesProvider');
  }
  return ctx;
}
