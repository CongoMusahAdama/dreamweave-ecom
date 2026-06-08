import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import type { ShopProduct } from '@/data/products';
import {
  fetchApiCatalog,
  getMergedShopProducts,
  resolveProductById,
} from '@/lib/shop-catalog';

type ShopCatalogContextValue = {
  products: ShopProduct[];
  loading: boolean;
  getProductById: (id: number) => ShopProduct | undefined;
  refresh: () => Promise<void>;
};

const ShopCatalogContext = createContext<ShopCatalogContextValue | null>(null);

export function ShopCatalogProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [apiLoaded, setApiLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await fetchApiCatalog();
    } finally {
      setApiLoaded(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onCatalogChange = () => {
      void refresh();
    };
    window.addEventListener('harv:catalog-changed', onCatalogChange);
    return () => window.removeEventListener('harv:catalog-changed', onCatalogChange);
  }, [refresh]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refresh]);

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/products') {
      void refresh();
    }
  }, [location.pathname, refresh]);

  const products = useMemo(() => getMergedShopProducts(), [apiLoaded, loading]);

  const value = useMemo(
    () => ({
      products,
      loading,
      getProductById: (id: number) => resolveProductById(id),
      refresh,
    }),
    [products, loading, refresh]
  );

  return (
    <ShopCatalogContext.Provider value={value}>{children}</ShopCatalogContext.Provider>
  );
}

export function useShopCatalog() {
  const ctx = useContext(ShopCatalogContext);
  if (!ctx) {
    throw new Error('useShopCatalog must be used within ShopCatalogProvider');
  }
  return ctx;
}
