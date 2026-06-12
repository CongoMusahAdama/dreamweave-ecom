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
import { formatAboutBody, DEFAULT_STORE_CITY, DEFAULT_STORE_EMAIL } from '@/lib/site-content';
import type { SiteSettings } from '../types/admin';

const Settings = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentLogoUrl, setCurrentLogoUrl] = useState('');
  const [currentHeroUrl, setCurrentHeroUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    logoAlt: 'HARV DREAMS',
    storeName: 'HARV DREAMS',
    storeEmail: DEFAULT_STORE_EMAIL,
    storePhone: '',
    storeCity: DEFAULT_STORE_CITY,
    heroImageAlt: 'HARV DREAMS campaign',
    aboutEyebrow: 'Our story',
    aboutTitle: 'About HARV DREAMS',
    aboutBody: '',
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
        setCurrentHeroUrl(s.heroImageUrl || '');
        setForm({
          logoAlt: s.logoAlt || 'HARV DREAMS',
          storeName: s.storeName || 'HARV DREAMS',
          storeEmail: s.storeEmail || '',
          storePhone: s.storePhone || '',
          storeCity: s.storeCity || '',
          heroImageAlt: s.heroImageAlt || 'HARV DREAMS campaign',
          aboutEyebrow: s.aboutEyebrow || 'Our story',
          aboutTitle: s.aboutTitle || 'About HARV DREAMS',
          aboutBody: formatAboutBody(s.aboutParagraphs || []),
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
      fd.append('heroImageAlt', form.heroImageAlt.trim());
      fd.append('aboutEyebrow', form.aboutEyebrow.trim());
      fd.append('aboutTitle', form.aboutTitle.trim());
      fd.append('aboutBody', form.aboutBody.trim());
      if (logoFile) fd.append('image', logoFile);
      if (heroFile) fd.append('heroImage', heroFile);

      const res = await apiFormFetch<{
        success: boolean;
        data: { settings: SiteSettings };
      }>('/api/settings', fd, { method: 'PUT', token });

      setCurrentLogoUrl(res.data.settings.logoUrl || '');
      setCurrentHeroUrl(res.data.settings.heroImageUrl || '');
      setLogoFile(null);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
      setHeroFile(null);
      if (heroPreview) URL.revokeObjectURL(heroPreview);
      setHeroPreview(null);
      setForm((f) => ({
        ...f,
        aboutBody: formatAboutBody(res.data.settings.aboutParagraphs || []),
      }));
      sweetSuccessCenter('Settings saved', 'Your site content is updated.');
      window.dispatchEvent(new CustomEvent('harv:settings-changed'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const displayLogo = logoPreview || (currentLogoUrl ? productImageUrl(currentLogoUrl) : '');
  const displayHero = heroPreview || (currentHeroUrl ? productImageUrl(currentHeroUrl) : '');

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Settings"
        description="Update branding, homepage hero, About page copy, and store contact details."
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

          <AdminPanel title="Homepage hero">
            <div className="space-y-4">
              {displayHero ? (
                <div>
                  <span className={ADMIN_LABEL}>Current hero image</span>
                  <div className="mt-1 border border-black/15 bg-white overflow-hidden">
                    <img
                      src={displayHero}
                      alt="Current homepage hero"
                      className="w-full max-h-48 object-cover"
                    />
                  </div>
                </div>
              ) : null}

              <AdminSingleImagePicker
                file={heroFile}
                preview={heroPreview}
                onChange={(file, preview) => {
                  setHeroFile(file);
                  setHeroPreview(preview);
                }}
                label="Upload new hero image"
                hint="Shown on the homepage banner. Landscape photos work best (JPG or PNG, max 5MB)."
              />

              <label className="block">
                <span className={ADMIN_LABEL}>Hero image alt text</span>
                <input
                  className={ADMIN_INPUT}
                  value={form.heroImageAlt}
                  onChange={(e) => setForm((f) => ({ ...f, heroImageAlt: e.target.value }))}
                />
              </label>

              <button type="submit" disabled={saving} className={ADMIN_BTN}>
                {saving ? 'Saving…' : 'Save homepage hero'}
              </button>
            </div>
          </AdminPanel>

          <AdminPanel title="About page">
            <div className="space-y-4">
              <label className="block">
                <span className={ADMIN_LABEL}>Eyebrow label</span>
                <input
                  className={ADMIN_INPUT}
                  value={form.aboutEyebrow}
                  onChange={(e) => setForm((f) => ({ ...f, aboutEyebrow: e.target.value }))}
                  placeholder="Our story"
                />
              </label>

              <label className="block">
                <span className={ADMIN_LABEL}>Page title</span>
                <input
                  className={ADMIN_INPUT}
                  value={form.aboutTitle}
                  onChange={(e) => setForm((f) => ({ ...f, aboutTitle: e.target.value }))}
                  placeholder="About HARV DREAMS"
                />
              </label>

              <label className="block">
                <span className={ADMIN_LABEL}>About copy</span>
                <textarea
                  className={`${ADMIN_INPUT} min-h-[200px] resize-y normal-case tracking-normal font-medium leading-relaxed`}
                  value={form.aboutBody}
                  onChange={(e) => setForm((f) => ({ ...f, aboutBody: e.target.value }))}
                  placeholder="Write your story here. Leave a blank line between paragraphs."
                />
                <p className="text-[8px] font-bold uppercase text-black/40 mt-2">
                  Separate paragraphs with a blank line
                </p>
              </label>

              <button type="submit" disabled={saving} className={ADMIN_BTN}>
                {saving ? 'Saving…' : 'Save about page'}
              </button>
            </div>
          </AdminPanel>

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
