import { apiFetch } from '@/lib/api';
import { productImageUrl } from '@/lib/productImage';
import type { ShopProduct } from '@/data/products';

let staticProducts: ShopProduct[] = [];

export function initStaticCatalog(products: ShopProduct[]) {
  staticProducts = products;
}

const CATALOG_ID_BASE = 1_000_000;

type ApiProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  soldOut?: boolean;
  isActive?: boolean;
  images?: { front?: string; back?: string; additional?: string[] };
  sizes?: { name: string; stock?: number }[];
};

const mongoIdByCatalogId = new Map<number, string>();
let apiCatalog: ShopProduct[] = [];

function catalogIdFromMongoId(mongoId: string): number {
  let hash = 0;
  for (let i = 0; i < mongoId.length; i++) {
    hash = (hash * 31 + mongoId.charCodeAt(i)) >>> 0;
  }
  return CATALOG_ID_BASE + (hash % 899_999);
}

function formatPrice(amount: number) {
  return `₵${amount.toLocaleString('en-GH', { maximumFractionDigits: 0 })}`;
}

export function mapApiProductToShop(p: ApiProduct): ShopProduct | null {
  if (p.isActive === false) return null;
  if (p.soldOut || p.stock <= 0) return null;

  const front = productImageUrl(p.images?.front);
  if (!front) return null;

  const back = productImageUrl(p.images?.back) || front;
  const extra = (p.images?.additional || []).map(productImageUrl).filter(Boolean);
  const images = Array.from(new Set([front, back, ...extra]));

  const sizesFromDb = p.sizes?.map((s) => s.name).filter(Boolean);
  const sizes =
    sizesFromDb && sizesFromDb.length > 0 ? sizesFromDb : ['S', 'M', 'L', 'XL'];

  const catalogId = catalogIdFromMongoId(p._id);
  mongoIdByCatalogId.set(catalogId, p._id);

  const priceLabel =
    p.originalPrice && p.originalPrice > p.price
      ? formatPrice(p.price)
      : formatPrice(p.price);

  return {
    id: catalogId,
    name: p.name,
    price: priceLabel,
    priceAmount: p.price,
    frontImage: front,
    backImage: back,
    images,
    category: p.category,
    stock: p.stock,
    sizes,
    description: p.description || '',
    details: [],
    mongoId: p._id,
  };
}

export type ShopProductWithMongo = ShopProduct & { mongoId?: string };

export async function fetchApiCatalog(): Promise<ShopProduct[]> {
  try {
    const res = await apiFetch<{
      success: boolean;
      data: { products: ApiProduct[] };
    }>('/api/products?limit=100&sort=createdAt&order=desc');

    const mapped = (res.data.products || [])
      .map(mapApiProductToShop)
      .filter((p): p is ShopProduct => Boolean(p));

    apiCatalog = mapped;
    return mapped;
  } catch {
    apiCatalog = [];
    return [];
  }
}

export function getApiCatalog(): ShopProduct[] {
  return apiCatalog;
}

export function getMergedShopProducts(): ShopProduct[] {
  const apiIds = new Set(apiCatalog.map((p) => p.id));
  const staticOnly = staticProducts.filter((p) => !apiIds.has(p.id));
  return [...apiCatalog, ...staticOnly];
}

export function resolveProductById(id: number): ShopProduct | undefined {
  return getMergedShopProducts().find((p) => p.id === id);
}

export function getMongoIdForCatalogProduct(id: number): string | undefined {
  return mongoIdByCatalogId.get(id);
}

export function isApiCatalogProduct(id: number): boolean {
  return mongoIdByCatalogId.has(id);
}
