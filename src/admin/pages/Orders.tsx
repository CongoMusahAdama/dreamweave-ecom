import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminOrdersList from '../components/orders/AdminOrdersList';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import type { AdminShopOrder } from '../types/admin';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;
const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<AdminShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (status !== 'all') params.set('status', status);
      if (search.trim()) params.set('search', search.trim());

      const res = await apiFetch<{
        success: boolean;
        data: {
          orders: AdminShopOrder[];
          pagination: { page: number; total: number; totalPages: number };
        };
      }>(`/api/shop-orders?${params}`, { token });

      setOrders(res.data.orders);
      setTotal(res.data.pagination.total);
      setTotalPages(res.data.pagination.totalPages);
    } catch {
      setOrders([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [token, page, status, search]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    setPage(1);
  }, [status, search]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!token) return;
    try {
      await apiFetch(`/api/shop-orders/${orderId}/status`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      /* keep UI unchanged on error */
    }
  };

  return (
    <AdminLayout orderCount={total}>
      <AdminPageHeader
        title="Manage orders"
        description="All customer orders site-wide. Update status and view delivery details."
      />

      <div className="mb-4 space-y-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order #, name, phone…"
          className="w-full border border-black/20 bg-white px-4 py-3 min-h-[48px] text-[10px] font-bold uppercase tracking-wider placeholder:text-black/30"
        />
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                'px-3 py-2 min-h-[40px] text-[9px] font-bold tracking-[0.12em] uppercase border transition-colors',
                status === s
                  ? 'bg-black text-white border-black'
                  : 'text-black/50 border-black/15 hover:border-black/30'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <AdminOrdersList
        orders={orders}
        loading={loading}
        onStatusChange={handleStatusChange}
        pagination={{
          page,
          totalPages,
          total,
          onPageChange: setPage,
        }}
      />
    </AdminLayout>
  );
};

export default Orders;
