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
import {
  SITE_LOGO_ALT,
  SITE_LOGO_NAV,
  SITE_LOGO_NAV_2X,
  SITE_LOGO_NAV_HEIGHT,
  SITE_LOGO_NAV_WIDTH,
} from '@/lib/brand';
import type { SiteSettings } from '@/admin/types/admin';
import {
  DEFAULT_ABOUT_EYEBROW,
  DEFAULT_ABOUT_PARAGRAPHS,
  DEFAULT_ABOUT_TITLE,
  DEFAULT_HERO_IMAGE,
  DEFAULT_HERO_IMAGE_ALT,
  DEFAULT_STORE_CITY,
  DEFAULT_STORE_EMAIL,
  resolveStoreCity,
  resolveStoreEmail,
} from '@/lib/site-content';
import { productImageUrl } from '@/lib/productImage';

type SiteSettingsContextValue = {
  settings: SiteSettings;
  loading: boolean;
  /** Real settings are known (cached or fetched) — safe to show hero/logo images. */
  ready: boolean;
  refresh: () => Promise<void>;
  logoSrc: string;
  logoSrcSet: string | undefined;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  heroImageSrc: string;
  heroImageAlt: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutParagraphs: string[];
  storeEmail: string;
  storePhone: string;
  storeCity: string;
};

const defaultSettings: SiteSettings = {
  logoUrl: '',
  logoAlt: SITE_LOGO_ALT,
  storeName: 'HARV DREAMS',
  storeEmail: DEFAULT_STORE_EMAIL,
  storePhone: '',
  storeCity: DEFAULT_STORE_CITY,
  heroImageUrl: DEFAULT_HERO_IMAGE,
  heroImageAlt: DEFAULT_HERO_IMAGE_ALT,
  aboutEyebrow: DEFAULT_ABOUT_EYEBROW,
  aboutTitle: DEFAULT_ABOUT_TITLE,
  aboutParagraphs: [...DEFAULT_ABOUT_PARAGRAPHS],
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

const SETTINGS_CACHE_KEY = 'hd_site_settings';

/** Last settings this browser saw — lets the hero/logo render correctly before the API answers. */
function readCachedSettings(): SiteSettings | null {
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE_KEY);
    return raw ? { ...defaultSettings, ...(JSON.parse(raw) as SiteSettings) } : null;
  } catch {
    return null;
  }
}

function writeCachedSettings(settings: SiteSettings) {
  try {
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
  } catch {
    /* storage unavailable — fine, we just won't have a warm start */
  }
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [cached] = useState(readCachedSettings);
  const [settings, setSettings] = useState<SiteSettings>(() => cached || defaultSettings);
  const [loading, setLoading] = useState(true);
  /** True once we know the real settings (from cache or the API) — avoids flashing defaults. */
  const [ready, setReady] = useState(Boolean(cached));

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        data: { settings: SiteSettings };
      }>('/api/settings');
      const next = res.data.settings || defaultSettings;
      setSettings(next);
      writeCachedSettings(next);
    } catch {
      // Keep whatever we already show (cache) rather than reverting to defaults
      setSettings((prev) => prev || defaultSettings);
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onChange = () => {
      void refresh();
    };
    window.addEventListener('harv:settings-changed', onChange);
    return () => window.removeEventListener('harv:settings-changed', onChange);
  }, [refresh]);

  const value = useMemo<SiteSettingsContextValue>(() => {
    const hasCustomLogo = Boolean(settings.logoUrl?.trim());
    const heroPath = settings.heroImageUrl?.trim() || DEFAULT_HERO_IMAGE;
    const paragraphs =
      settings.aboutParagraphs?.length > 0
        ? settings.aboutParagraphs
        : DEFAULT_ABOUT_PARAGRAPHS;

    return {
      settings,
      loading,
      ready,
      refresh,
      logoSrc: hasCustomLogo ? settings.logoUrl : SITE_LOGO_NAV,
      logoSrcSet: hasCustomLogo ? undefined : `${SITE_LOGO_NAV} 1x, ${SITE_LOGO_NAV_2X} 2x`,
      logoAlt: settings.logoAlt?.trim() || SITE_LOGO_ALT,
      logoWidth: SITE_LOGO_NAV_WIDTH,
      logoHeight: SITE_LOGO_NAV_HEIGHT,
      heroImageSrc: productImageUrl(heroPath) || productImageUrl(DEFAULT_HERO_IMAGE),
      heroImageAlt: settings.heroImageAlt?.trim() || DEFAULT_HERO_IMAGE_ALT,
      aboutEyebrow: settings.aboutEyebrow?.trim() || DEFAULT_ABOUT_EYEBROW,
      aboutTitle: settings.aboutTitle?.trim() || DEFAULT_ABOUT_TITLE,
      aboutParagraphs: paragraphs,
      storeEmail: resolveStoreEmail(settings.storeEmail),
      storePhone: settings.storePhone?.trim() || '',
      storeCity: resolveStoreCity(settings.storeCity),
    };
  }, [settings, loading, ready, refresh]);

  return (
    <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return ctx;
}
