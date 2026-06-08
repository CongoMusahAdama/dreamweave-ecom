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

type SiteSettingsContextValue = {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => Promise<void>;
  logoSrc: string;
  logoSrcSet: string | undefined;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
};

const defaultSettings: SiteSettings = {
  logoUrl: '',
  logoAlt: SITE_LOGO_ALT,
  storeName: 'HARV DREAMS',
  storeEmail: '',
  storePhone: '',
  storeCity: '',
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        data: { settings: SiteSettings };
      }>('/api/settings');
      setSettings(res.data.settings || defaultSettings);
    } catch {
      setSettings(defaultSettings);
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
    window.addEventListener('harv:settings-changed', onChange);
    return () => window.removeEventListener('harv:settings-changed', onChange);
  }, [refresh]);

  const value = useMemo<SiteSettingsContextValue>(() => {
    const hasCustomLogo = Boolean(settings.logoUrl?.trim());
    return {
      settings,
      loading,
      refresh,
      logoSrc: hasCustomLogo ? settings.logoUrl : SITE_LOGO_NAV,
      logoSrcSet: hasCustomLogo ? undefined : `${SITE_LOGO_NAV} 1x, ${SITE_LOGO_NAV_2X} 2x`,
      logoAlt: settings.logoAlt?.trim() || SITE_LOGO_ALT,
      logoWidth: SITE_LOGO_NAV_WIDTH,
      logoHeight: SITE_LOGO_NAV_HEIGHT,
    };
  }, [settings, loading, refresh]);

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
