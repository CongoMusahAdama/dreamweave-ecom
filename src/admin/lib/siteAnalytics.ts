export type VisitPeriod = 'today' | 'yesterday' | '7d' | '30d' | '90d' | '12m' | 'custom';
export type VisitGranularity = 'hour' | 'day' | 'month';

export type VisitTotals = {
  pageViews: number;
  visitors: number;
  newVisitors: number;
  sessions: number;
  bounceRate: number;
  pagesPerSession: number;
  paidOrders: number;
  conversionRate: number;
};

export type VisitSeriesPoint = { key: string; views: number; visitors: number };
export type VisitBreakdownRow = { key: string; views: number; visitors: number };
export type VisitCityRow = { city: string; country: string; views: number; visitors: number };

export type SiteAnalytics = {
  range: { start: string; end: string; granularity: VisitGranularity };
  totals: VisitTotals;
  previous: VisitTotals;
  liveVisitors: number;
  series: VisitSeriesPoint[];
  countries: VisitBreakdownRow[];
  cities: VisitCityRow[];
  pages: VisitBreakdownRow[];
  referrers: VisitBreakdownRow[];
  devices: VisitBreakdownRow[];
  browsers: VisitBreakdownRow[];
  os: VisitBreakdownRow[];
};

export const VISIT_PERIODS: { id: VisitPeriod; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: '12m', label: '12 months' },
  { id: 'custom', label: 'Custom' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Chart axis label for a bucket key from the API (UTC = Ghana time). */
export function bucketLabel(key: string, granularity: VisitGranularity) {
  if (granularity === 'hour') {
    const hour = Number(key.slice(11, 13));
    const suffix = hour < 12 ? 'am' : 'pm';
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${Number(key.slice(8, 10))} ${MONTHS[Number(key.slice(5, 7)) - 1]}, ${h12}${suffix}`;
  }
  if (granularity === 'month') {
    return `${MONTHS[Number(key.slice(5, 7)) - 1]} ${key.slice(2, 4)}`;
  }
  return `${Number(key.slice(8, 10))} ${MONTHS[Number(key.slice(5, 7)) - 1]}`;
}

let regionNames: Intl.DisplayNames | null = null;
try {
  regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
} catch {
  regionNames = null;
}

export function countryName(code: string) {
  if (!code) return 'Unknown';
  try {
    return regionNames?.of(code) || code;
  } catch {
    return code;
  }
}

/** Small flag image (emoji flags don't render on Windows). Null for unknown countries. */
export function countryFlagUrl(code: string) {
  if (!/^[A-Z]{2}$/.test(code)) return null;
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

const STATIC_PAGES: Record<string, string> = {
  '/': 'Home',
  '/products': 'Shop — all products',
  '/cart': 'Cart',
  '/gallery': 'Gallery',
  '/about': 'About',
  '/shipping': 'Shipping & returns',
  '/privacy': 'Privacy',
  '/account': 'My account',
  '/payment/callback': 'Payment result',
  '/payment/momo': 'MoMo payment',
};

export function pageLabel(path: string, productName: (id: number) => string | undefined) {
  if (STATIC_PAGES[path]) return STATIC_PAGES[path];
  const product = path.match(/^\/products\/(\d+)$/);
  if (product) return productName(Number(product[1])) || `Product #${product[1]}`;
  return path;
}

export function referrerLabel(host: string) {
  if (!host) return 'Direct / typed link';
  if (/instagram/.test(host)) return 'Instagram';
  if (/facebook|fb\.|^m\.me$|messenger/.test(host)) return 'Facebook';
  if (/tiktok/.test(host)) return 'TikTok';
  if (/whatsapp|wa\.me/.test(host)) return 'WhatsApp';
  if (/^t\.co$|twitter|x\.com/.test(host)) return 'X (Twitter)';
  if (/snapchat/.test(host)) return 'Snapchat';
  if (/google\./.test(host)) return 'Google';
  if (/bing\./.test(host)) return 'Bing';
  return host;
}

export const DEVICE_LABELS: Record<string, string> = {
  mobile: 'Phone',
  tablet: 'Tablet',
  desktop: 'Laptop / desktop',
};

/** % change vs the previous period; null when there is nothing to compare against. */
export function percentChange(current: number, previous: number) {
  if (!previous) return current ? null : 0;
  return ((current - previous) / previous) * 100;
}

export function toDateInput(d: Date) {
  return d.toISOString().slice(0, 10);
}
