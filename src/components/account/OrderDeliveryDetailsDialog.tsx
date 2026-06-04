import { X } from 'lucide-react';
import type { ShopOrder } from '@/types/customer';
import { formatDeliveryBlock } from '@/lib/delivery';

type OrderDeliveryDetailsDialogProps = {
  order: ShopOrder | null;
  onClose: () => void;
};

const OrderDeliveryDetailsDialog = ({ order, onClose }: OrderDeliveryDetailsDialogProps) => {
  if (!order) return null;

  const d = order.shippingAddress;
  const hasAddress =
    d?.fullName?.trim() ||
    d?.phone?.trim() ||
    d?.street?.trim() ||
    d?.pickupStation?.trim() ||
    d?.city?.trim();

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white border border-black border-b-0 sm:border-b max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-none pb-[env(safe-area-inset-bottom)]">
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <span className="w-10 h-1 rounded-full bg-black/15" aria-hidden />
        </div>
        <div className="flex items-center justify-between border-b border-black px-4 py-4">
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase">Delivery details</h2>
            <p className="text-[10px] font-bold text-black/50 mt-1">{order.orderNumber}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 min-h-[44px] min-w-[44px]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          {!hasAddress ? (
            <p className="text-[10px] font-bold uppercase text-black/50">No delivery details saved for this order.</p>
          ) : (
            <div className="p-4 border border-black bg-[#fafafa]">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-2">
                {d.deliveryMethod === 'pickup' ? 'Pickup' : 'Home delivery'}
              </p>
              <pre className="text-[10px] font-bold uppercase text-black/70 leading-relaxed whitespace-pre-wrap break-words font-[inherit]">
                {formatDeliveryBlock(d)}
              </pre>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full border border-black py-3 min-h-[48px] text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDeliveryDetailsDialog;
