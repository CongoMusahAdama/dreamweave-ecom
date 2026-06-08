import { useEffect, useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminPanel from '../components/ui/AdminPanel';
import AdminSingleImagePicker from '../components/ui/AdminSingleImagePicker';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { apiFormFetch, ADMIN_INPUT, ADMIN_LABEL, ADMIN_BTN } from '../lib/apiForm';
import { sweetSuccessCenter } from '@/lib/sweet-alert';
import { productImageUrl } from '../lib/productImage';
import type { SiteSettings } from '../types/admin';

const Settings = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentLogoUrl, setCurrentLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    logoAlt: 'HARV DREAMS',
    storeName: 'HARV DREAMS',
    storeEmail: '',
    storePhone: '',
    storeCity: '',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await apiFetch<{
          success: boolean;
          data: { settings: SiteSettings };
        }>('/api/settings');
        if (cancelled) return;
        const s = res.data.settings;
        setCurrentLogoUrl(s.logoUrl || '');
        setForm({
          logoAlt: s.logoAlt || 'HARV DREAMS',
          storeName: s.storeName || 'HARV DREAMS',
          storeEmail: s.storeEmail || '',
          storePhone: s.storePhone || '',
          storeCity: s.storeCity || '',
        });
      } catch {
        if (!cancelled) setError('Could not load settings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('logoAlt', form.logoAlt.trim());
      fd.append('storeName', form.storeName.trim());
      fd.append('storeEmail', form.storeEmail.trim());
      fd.append('storePhone', form.storePhone.trim());
      fd.append('storeCity', form.storeCity.trim());
      if (logoFile) fd.append('image', logoFile);

      const res = await apiFormFetch<{
        success: boolean;
        data: { settings: SiteSettings };
      }>('/api/settings', fd, { method: 'PUT', token });

      setCurrentLogoUrl(res.data.settings.logoUrl || '');
      setLogoFile(null);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
      sweetSuccessCenter('Settings saved', 'Your store branding is updated.');
      window.dispatchEvent(new CustomEvent('harv:settings-changed'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const displayLogo = logoPreview || (currentLogoUrl ? productImageUrl(currentLogoUrl) : '');

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Settings"
        description="Update your store logo, contact details, and branding."
      />

      {loading ? (
        <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse">Loading…</p>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {error ? (
            <p className="lg:col-span-2 text-[9px] font-bold uppercase text-red-700 bg-red-50 border border-red-200 px-3 py-2">
              {error}
            </p>
          ) : null}

          <AdminPanel title="Branding">
            <div className="space-y-4">
              {displayLogo ? (
                <div>
                  <span className={ADMIN_LABEL}>Current navbar logo</span>
                  <div className="mt-1 border border-black/15 bg-white p-4 inline-block">
                    <img
                      src={displayLogo}
                      alt="Current logo"
                      className="h-12 w-auto max-w-[200px] object-contain"
                    />
                  </div>
                </div>
              ) : null}

              <AdminSingleImagePicker
                file={logoFile}
                preview={logoPreview}
                onChange={(file, preview) => {
                  setLogoFile(file);
                  setLogoPreview(preview);
                }}
                label="Upload new logo"
                hint="PNG or JPG with a transparent or white background works best. Shown in the top navbar."
              />

              <label className="block">
                <span className={ADMIN_LABEL}>Logo alt text</span>
                <input
                  className={ADMIN_INPUT}
                  value={form.logoAlt}
                  onChange={(e) => setForm((f) => ({ ...f, logoAlt: e.target.value }))}
                />
              </label>

              <button type="submit" disabled={saving} className={ADMIN_BTN}>
                {saving ? 'Saving…' : 'Save branding'}
              </button>
            </div>
          </AdminPanel>

          <AdminPanel title="Store contact">
            <div className="space-y-4">
              {[
                { id: 'storeName', label: 'Store name', key: 'storeName' as const },
                { id: 'storeEmail', label: 'Email', key: 'storeEmail' as const },
                { id: 'storePhone', label: 'Phone', key: 'storePhone' as const },
                { id: 'storeCity', label: 'City', key: 'storeCity' as const },
              ].map((field) => (
                <label key={field.id} className="block">
                  <span className={ADMIN_LABEL}>{field.label}</span>
                  <input
                    id={field.id}
                    className={ADMIN_INPUT}
                    value={form[field.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  />
                </label>
              ))}
              <button type="submit" disabled={saving} className={ADMIN_BTN}>
                {saving ? 'Saving…' : 'Save contact info'}
              </button>
            </div>
          </AdminPanel>
        </form>
      )}
    </AdminLayout>
  );
};

export default Settings;
