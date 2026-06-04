import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import type { AdminCustomer } from '../types/admin';
import { formatShortDate } from '../lib/format';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 15;

const Customers = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadCustomers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (search.trim()) params.set('search', search.trim());

      const res = await apiFetch<{
        success: boolean;
        data: {
          customers: AdminCustomer[];
          pagination: {
            currentPage: number;
            totalPages: number;
            totalCustomers: number;
          };
        };
      }>(`/api/customers?${params}`, { token });

      setCustomers(res.data.customers);
      setTotal(res.data.pagination.totalCustomers);
      setTotalPages(res.data.pagination.totalPages);
    } catch {
      setCustomers([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [token, page, search]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <AdminLayout orderCount={0} productCount={0}>
      <AdminPageHeader
        title="Customers"
        description="Registered shopper accounts on HARV DREAMS."
      />

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, email, phone…"
        className="w-full mb-4 border border-black/20 bg-white px-4 py-3 min-h-[48px] text-[10px] font-bold uppercase tracking-wider placeholder:text-black/30"
      />

      {loading ? (
        <div className="py-12 text-center border border-black/10">
          <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse">
            Loading customers…
          </p>
        </div>
      ) : customers.length === 0 ? (
        <div className="border border-dashed border-black/20 p-8 sm:p-12 text-center">
          <p className="text-[11px] font-bold uppercase text-black/50">No customers found</p>
        </div>
      ) : (
        <>
          <ul className="border border-black/10 divide-y divide-black/10 bg-white">
            {customers.map((c) => (
              <li
                key={c._id}
                className="px-4 py-4 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-black">
                    {c.name}
                  </p>
                  <p className="text-[9px] font-bold text-black/45 mt-0.5 break-all">{c.email}</p>
                  {c.phone && (
                    <p className="text-[9px] font-bold text-black/35 mt-0.5">{c.phone}</p>
                  )}
                </div>
                <p className="text-[8px] font-bold uppercase text-black/35 shrink-0">
                  Joined {formatShortDate(c.createdAt)}
                </p>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-black/10">
              <p className="text-[9px] font-bold uppercase text-black/40">
                {total} customers · page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className={cn(
                    'min-h-[44px] px-4 border border-black/20 text-[9px] font-bold uppercase',
                    page <= 1 && 'opacity-30 cursor-not-allowed'
                  )}
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className={cn(
                    'min-h-[44px] px-4 border border-black/20 text-[9px] font-bold uppercase',
                    page >= totalPages && 'opacity-30 cursor-not-allowed'
                  )}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default Customers;
