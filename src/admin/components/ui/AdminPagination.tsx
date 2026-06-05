import { cn } from '@/lib/utils';

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

const AdminPagination = ({ page, totalPages, total, onPageChange }: AdminPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-black/10 mt-4">
      <p className="text-[9px] font-bold uppercase text-black/40 text-center sm:text-left">
        Page {page} of {totalPages} · {total} total
      </p>
      <div className="flex gap-2 justify-center sm:justify-end">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn(
            'min-h-[48px] flex-1 sm:flex-none sm:min-w-[88px] px-4 border border-black/20 text-[10px] font-bold uppercase',
            page <= 1 && 'opacity-30 cursor-not-allowed'
          )}
        >
          Prev
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={cn(
            'min-h-[48px] flex-1 sm:flex-none sm:min-w-[88px] px-4 border border-black/20 text-[10px] font-bold uppercase',
            page >= totalPages && 'opacity-30 cursor-not-allowed'
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
