import { useRef } from 'react';
import type { AdminShopOrder } from '@/admin/types/admin';
import { formatGhs, formatShortDate } from '@/admin/lib/format';
import { ADMIN_BTN, ADMIN_BTN_OUTLINE } from '@/admin/lib/apiForm';

type OrderReceiptProps = {
  order: AdminShopOrder;
  onClose: () => void;
};

function customerName(order: AdminShopOrder) {
  const c = order.customer;
  if (c && typeof c === 'object') return c.name;
  return order.shippingAddress?.fullName || 'Customer';
}

const OrderReceipt = ({ order, onClose }: OrderReceiptProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open('', '_blank', 'width=480,height=720');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html><html><head><title>Receipt ${order.orderNumber}</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 24px; color: #111; font-size: 12px; }
        h1 { font-size: 14px; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 4px; }
        .muted { color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th, td { text-align: left; padding: 8px 4px; border-bottom: 1px solid #eee; font-size: 11px; }
        th { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; }
        .total { font-weight: 700; font-size: 14px; margin-top: 12px; }
      </style></head><body>${content.innerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md bg-white border border-black/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase">Receipt</p>
          <button
            type="button"
            onClick={onClose}
            className="text-[9px] font-bold uppercase text-black/50 hover:text-black min-h-[44px] px-2"
          >
            Close
          </button>
        </div>

        <div ref={printRef} className="p-5 space-y-4">
          <div>
            <h1 className="text-[12px] font-bold tracking-[0.12em] uppercase">HARV DREAMS</h1>
            <p className="text-[9px] font-bold uppercase text-black/45 mt-1">Order receipt</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[9px] font-bold uppercase">
            <div>
              <p className="text-black/40">Order</p>
              <p className="text-black mt-0.5">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-black/40">Date</p>
              <p className="text-black mt-0.5">{formatShortDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-black/40">Customer</p>
              <p className="text-black mt-0.5">{customerName(order)}</p>
            </div>
            <div>
              <p className="text-black/40">Status</p>
              <p className="text-black mt-0.5">{order.status}</p>
            </div>
            {order.paymentStatus && (
              <div>
                <p className="text-black/40">Payment</p>
                <p className="text-black mt-0.5">{order.paymentStatus}</p>
              </div>
            )}
            <div>
              <p className="text-black/40">Channel</p>
              <p className="text-black mt-0.5">{order.channel}</p>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 text-[8px] font-bold uppercase text-black/40">Item</th>
                <th className="text-right py-2 text-[8px] font-bold uppercase text-black/40">Qty</th>
                <th className="text-right py-2 text-[8px] font-bold uppercase text-black/40">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-black/5">
                  <td className="py-2 text-[9px] font-bold uppercase">
                    {item.name}
                    <span className="text-black/40 block text-[8px]">{item.size}</span>
                  </td>
                  <td className="py-2 text-right text-[9px] tabular-nums">{item.quantity}</td>
                  <td className="py-2 text-right text-[9px]">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-[13px] font-bold tabular-nums border-t border-black/10 pt-3">
            Total {formatGhs(order.totalAmount)}
          </p>

          {order.shippingAddress && (
            <div className="text-[9px] font-bold uppercase text-black/50 leading-relaxed pt-2 border-t border-black/10">
              <p className="text-black/40 mb-1">Delivery</p>
              {order.shippingAddress.deliveryMethod === 'pickup'
                ? `Pickup: ${order.shippingAddress.pickupStation || '—'}`
                : `${order.shippingAddress.street || ''}, ${order.shippingAddress.city}, ${order.shippingAddress.region}`}
              <br />
              {order.shippingAddress.phone}
            </div>
          )}
        </div>

        <div className="flex gap-2 p-4 border-t border-black/10">
          <button type="button" onClick={handlePrint} className={`flex-1 ${ADMIN_BTN}`}>
            Print receipt
          </button>
          <button type="button" onClick={onClose} className={ADMIN_BTN_OUTLINE}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
