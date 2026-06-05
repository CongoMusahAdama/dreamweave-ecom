import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { shopProducts, type ShopProduct } from '@/data/products';
import {
  fetchApiCatalog,
  getMergedShopProducts,
  initStaticCatalog,
  resolveProductById,
} from '@/lib/shop-catalog';

type ShopCatalogContextValue = {
  products: ShopProduct[];
  loading: boolean;
  getProductById: (id: number) => ShopProduct | undefined;
  refresh: () => Promise<void>;
};

const ShopCatalogContext = createContext<ShopCatalogContextValue | null>(null);

initStaticCatalog(shopProducts);

export function ShopCatalogProvider({ children }: { children: ReactNode }) {
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
