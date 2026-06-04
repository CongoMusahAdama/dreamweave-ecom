import { formatGhs } from '@/admin/lib/format';
import type { AdminStats } from '@/admin/types/admin';

type AdminStatGridProps = {
  stats: AdminStats;
  loading?: boolean;
};

const ITEMS: {
  key: keyof AdminStats;
  label: string;
  format: (v: number) => string;
}[] = [
  { key: 'totalSales', label: 'Revenue', format: formatGhs },
  { key: 'totalOrders', label: 'Orders', format: (v) => v.toLocaleString() },
  { key: 'totalCustomers', label: 'Customers', format: (v) => v.toLocaleString() },
  { key: 'totalProducts', label: 'Products', format: (v) => v.toLocaleString() },
];

const AdminStatGrid = ({ stats, loading }: AdminStatGridProps) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
    {ITEMS.map((item) => (
      <div
        key={item.key}
        className="border border-black/10 bg-black/[0.02] p-3 sm:p-4 text-center sm:text-left"
      >
        <p className="text-[8px] sm:text-[9px] font-bold tracking-[0.18em] uppercase text-black/40">
          {item.label}
        </p>
        <p className="text-lg sm:text-xl font-bold tabular-nums mt-1 text-black">
          {loading ? '—' : item.format(stats[item.key])}
        </p>
      </div>
    ))}
  </div>
);

export default AdminStatGrid;
