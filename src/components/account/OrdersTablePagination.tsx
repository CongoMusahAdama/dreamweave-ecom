import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ORDERS_PAGE_SIZE = 5;

type OrdersTablePaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const OrdersTablePagination = ({
  page,
  totalPages,
  total,
  onPageChange,
  className,
}: OrdersTablePaginationProps) => {
  if (totalPages <= 1) return null;

  const start = (page - 1) * ORDERS_PAGE_SIZE + 1;
  const end = Math.min(page * ORDERS_PAGE_SIZE, total);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 px-4 py-4 border-t border-black/10 bg-black/[0.02]',
        className
      )}
    >
      <p className="text-[9px] font-bold uppercase tracking-wider text-black/45 text-center sm:text-left">
        Showing {start}–{end} of {total} orders
      </p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center justify-center gap-1 border border-black/20 px-3 py-3 min-h-[48px] text-[9px] font-bold tracking-[0.12em] uppercase disabled:opacity-40 active:bg-black/[0.04] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>
        <span className="text-[10px] font-bold uppercase tracking-wider text-black tabular-nums text-center px-2">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center justify-center gap-1 border border-black/20 px-3 py-3 min-h-[48px] text-[9px] font-bold tracking-[0.12em] uppercase disabled:opacity-40 active:bg-black/[0.04] transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OrdersTablePagination;
