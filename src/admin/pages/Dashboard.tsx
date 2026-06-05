import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Images } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminStatGrid from '../components/ui/AdminStatGrid';
import AdminPanel from '../components/ui/AdminPanel';
import AdminStatusBadge from '../components/ui/AdminStatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import type { AdminStats, DashboardPayload, AdminShopOrder } from '../types/admin';
import { formatGhs, formatShortDate } from '../lib/format';

const emptyStats: AdminStats = {
  totalSales: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalProducts: 0,
  recentSales: 0,
  lowStockProducts: 0,
};

const QUICK = [
  {
    to: '/admin/orders',
    label: 'Track orders',
    hint: 'Update status & print receipts',
    icon: ShoppingCart,
  },
  {
    to: '/admin/products',
    label: 'Add products',
    hint: 'Upload photos, price & stock',
    icon: Package,
  },
  {
    to: '/admin/gallery',
    label: 'Gallery',
    hint: 'Publish lifestyle photos',
    icon: Images,
  },
];

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats>(emptyStats);
  const [recentOrders, setRecentOrders] = useState<AdminShopOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await apiFetch<{ success: boolean; data: DashboardPayload }>(
          '/api/admin/dashboard',
          { token }
        );
        if (!cancelled) {
          setStats(res.data.stats);
          setRecentOrders(res.data.recentOrders || []);
        }
      } catch {
        if (!cancelled) {
          setStats(emptyStats);
          setRecentOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <AdminLayout orderCount={stats.totalOrders} productCount={stats.totalProducts}>
      <AdminPageHeader
        title="Overview"
        description="Manage orders, products, and gallery from one place."
      />

      <AdminStatGrid stats={stats} loading={loading} />

      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {QUICK.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="border border-black/10 p-4 min-h-[88px] hover:border-black/30 transition-colors flex flex-col justify-between"
            >
              <Icon className="w-4 h-4 text-black/50" strokeWidth={2} />
              <div>
                <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-black">
                  {item.label}
                </p>
                <p className="text-[9px] font-bold text-black/40 mt-1 uppercase">{item.hint}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 sm:mt-8">
        <AdminPanel
          title="Recent orders"
          action={
            <Link
              to="/admin/orders"
              className="text-[9px] font-bold tracking-[0.12em] uppercase text-black/50 hover:text-black"
            >
              View all →
            </Link>
          }
        >
          {loading ? (
            <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse">Loading…</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-[10px] font-bold uppercase text-black/40">No orders yet</p>
          ) : (
            <ul className="divide-y divide-black/10 -mx-4 sm:-mx-5">
              {recentOrders.map((order) => (
                <li
                  key={order._id}
                  className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-black">
                      {order.orderNumber}
                    </p>
                    <p className="text-[9px] font-bold text-black/45 mt-0.5">
                      {formatShortDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AdminStatusBadge status={order.status} />
                    <span className="text-[11px] font-bold tabular-nums">
                      {formatGhs(order.totalAmount)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
