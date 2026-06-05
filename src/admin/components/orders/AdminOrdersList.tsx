import { useState } from 'react';
import { MapPin, FileText } from 'lucide-react';
import type { AdminShopOrder } from '@/admin/types/admin';
import AdminStatusBadge from '@/admin/components/ui/AdminStatusBadge';
import OrderReceipt from '@/admin/components/orders/OrderReceipt';
import { formatGhs, formatShortDate } from '@/admin/lib/format';
import { getProductById } from '@/data/products';
import { ADMIN_BTN_OUTLINE } from '@/admin/lib/apiForm';
import { cn } from '@/lib/utils';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

type AdminOrdersListProps = {
  orders: AdminShopOrder[];
  loading?: boolean;
  onStatusChange: (orderId: string, status: string) => void;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number) => void;
  };
};

function customerLabel(order: AdminShopOrder) {
  const c = order.customer;
  if (c && typeof c === 'object') {
    return { name: c.name, email: c.email, phone: c.phone };
  }
  const addr = order.shippingAddress;
  return {
    name: addr?.fullName || 'Customer',
    email: '',
    phone: addr?.phone,
  };
}

const AdminOrdersList = ({
  orders,
  loading,
  onStatusChange,
  pagination,
}: AdminOrdersListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<AdminShopOrder | null>(null);

  if (loading) {
    return (
      <div className="py-12 text-center border border-black/10">
        <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse">
          Loading orders…
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="border border-dashed border-black/20 p-8 sm:p-12 text-center">
        <p className="text-[11px] font-bold uppercase text-black/50">No orders yet</p>
        <p className="text-[10px] font-bold text-black/40 mt-2 uppercase tracking-wider">
          Orders from WhatsApp or Paystack checkout will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const customer = customerLabel(order);
        const expanded = expandedId === order._id;

        return (
          <article key={order._id} className="border border-black/10 bg-white">
            <button
              type="button"
              onClick={() => setExpandedId(expanded ? null : order._id)}
              className="w-full text-left p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between min-h-[48px]"
            >
              <div className="flex gap-3 min-w-0">
                <div className="flex gap-1 shrink-0">
                  {order.items.slice(0, 2).map((item) => {
                    const src = getProductById(item.productId)?.frontImage;
                    return src ? (
                      <img
                        key={`${item.productId}-${item.size}`}
                        src={src}
                        alt=""
                        className="h-12 w-12 object-cover border border-black/10"
                      />
                    ) : (
                      <div
                        key={`${item.productId}-${item.size}`}
                        className="h-12 w-12 border border-black/10 bg-black/5"
                      />
                    );
                  })}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-black">
                    {order.orderNumber}
                  </p>
                  <p className="text-[9px] font-bold text-black/50 mt-0.5 truncate">
                    {customer.name}
                    {customer.phone ? ` · ${customer.phone}` : ''}
                  </p>
                  <p className="text-[8px] font-bold uppercase text-black/35 mt-1">
                    {formatShortDate(order.createdAt)} · {order.channel}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <AdminStatusBadge status={order.status} />
                {order.paymentStatus && (
                  <AdminStatusBadge status={order.paymentStatus} />
                )}
                <span className="text-[11px] font-bold tabular-nums text-black">
                  {formatGhs(order.totalAmount)}
                </span>
              </div>
            </button>

            {expanded && (
              <div className="px-4 pb-4 pt-0 border-t border-black/10 space-y-4">
                <ul className="space-y-2">
                  {order.items.map((item, i) => (
                    <li
                      key={`${item.productId}-${item.size}-${i}`}
                      className="text-[9px] font-bold uppercase text-black/60 flex justify-between gap-2"
                    >
                      <span>
                        {item.name} · {item.size} × {item.quantity}
                      </span>
                      <span className="text-black">{item.price}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-start gap-2 text-[9px] font-bold uppercase text-black/50">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {order.shippingAddress.deliveryMethod === 'pickup'
                      ? `Pickup: ${order.shippingAddress.pickupStation || '—'}`
                      : `${order.shippingAddress.street || ''}, ${order.shippingAddress.city}, ${order.shippingAddress.region}`}
                  </span>
                </div>

                <label className="block">
                  <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-black/40">
                    Update status
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order._id, e.target.value)}
                    className="mt-1 w-full border border-black/20 bg-white px-3 py-2.5 min-h-[48px] text-[10px] font-bold uppercase tracking-wider text-black"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => setReceiptOrder(order)}
                  className={`w-full mt-2 ${ADMIN_BTN_OUTLINE} gap-2`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Generate receipt
                </button>
              </div>
            )}
          </article>
        );
      })}

      {receiptOrder && (
        <OrderReceipt order={receiptOrder} onClose={() => setReceiptOrder(null)} />
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-black/10">
          <p className="text-[9px] font-bold uppercase text-black/40">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className={cn(
                'min-h-[44px] min-w-[44px] border border-black/20 text-[9px] font-bold uppercase',
                pagination.page <= 1 && 'opacity-30 cursor-not-allowed'
              )}
            >
              Prev
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className={cn(
                'min-h-[44px] min-w-[44px] border border-black/20 text-[9px] font-bold uppercase',
                pagination.page >= pagination.totalPages && 'opacity-30 cursor-not-allowed'
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersList;
