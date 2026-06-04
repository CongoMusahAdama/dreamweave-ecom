import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats>(emptyStats);
  const [recentOrders, setRecentOrders] = useState<AdminShopOrder[]>([]);
  const [lowStock, setLowStock] = useState<DashboardPayload['lowStockProducts']>([]);
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
          setLowStock(res.data.lowStockProducts || []);
        }
      } catch {
        if (!cancelled) {
          setStats(emptyStats);
          setRecentOrders([]);
          setLowStock([]);
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
        description="Sales, orders, and stock at a glance for HARV DREAMS."
      />

      <AdminStatGrid stats={stats} loading={loading} />

      <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
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
              <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse">
                Loading…
              </p>
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

        <div className="space-y-4 sm:space-y-6">
          <AdminPanel title="Quick links">
            <div className="space-y-2">
              {[
                { to: '/admin/orders', label: 'Manage orders', hint: 'Update status & delivery' },
                { to: '/admin/products', label: 'Product catalog', hint: 'Stock & listings' },
                { to: '/admin/customers', label: 'Customers', hint: 'Accounts & contact' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block border border-black/10 px-4 py-3 min-h-[48px] hover:border-black/30 transition-colors"
                >
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-black">
                    {link.label}
                  </p>
                  <p className="text-[9px] font-bold text-black/40 mt-1 uppercase">{link.hint}</p>
                </Link>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel title="Low stock">
            {lowStock.length === 0 ? (
              <p className="text-[10px] font-bold uppercase text-black/40">
                {loading ? 'Loading…' : 'All products stocked'}
              </p>
            ) : (
              <ul className="space-y-2">
                {lowStock.map((p) => (
                  <li
                    key={p._id}
                    className="flex justify-between gap-2 text-[9px] font-bold uppercase"
                  >
                    <span className="text-black truncate">{p.name}</span>
                    <span className="text-amber-800 shrink-0">{p.stock} left</span>
                  </li>
                ))}
              </ul>
            )}
          </AdminPanel>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
