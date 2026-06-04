import AdminLayout from '../components/layout/AdminLayout';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminPanel from '../components/ui/AdminPanel';

const Settings = () => {
  return (
    <AdminLayout>
      <AdminPageHeader
        title="Settings"
        description="Store contact and notifications — saved locally for now until a settings API is added."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <AdminPanel title="Store">
          <div className="space-y-4">
            {[
              { id: 'storeName', label: 'Store name', defaultValue: 'HARV DREAMS' },
              { id: 'storeEmail', label: 'Email', defaultValue: 'info@harvdreams.com' },
              { id: 'storePhone', label: 'Phone', defaultValue: '+233' },
              { id: 'storeCity', label: 'City', defaultValue: 'Accra, Ghana' },
            ].map((field) => (
              <label key={field.id} className="block">
                <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-black/40">
                  {field.label}
                </span>
                <input
                  id={field.id}
                  defaultValue={field.defaultValue}
                  className="mt-1 w-full border border-black/20 bg-white px-3 py-2.5 min-h-[48px] text-[10px] font-bold uppercase tracking-wider text-black"
                />
              </label>
            ))}
            <button
              type="button"
              className="w-full border border-black bg-black text-white py-3.5 min-h-[48px] text-[10px] font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
            >
              Save (coming soon)
            </button>
          </div>
        </AdminPanel>

        <AdminPanel title="Checkout & support">
          <ul className="space-y-3 text-[9px] font-bold uppercase text-black/55 leading-relaxed">
            <li>WhatsApp checkout — active on storefront</li>
            <li>Paystack — configure keys in backend .env</li>
            <li>Ghana delivery & pickup — customer account delivery tab</li>
          </ul>
          <p className="mt-4 text-[8px] font-bold tracking-[0.12em] uppercase text-black/35">
            Admin API: /api/admin/dashboard · /api/shop-orders
          </p>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default Settings;
