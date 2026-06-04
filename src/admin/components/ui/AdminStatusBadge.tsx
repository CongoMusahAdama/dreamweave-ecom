import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-900 border-amber-200',
  confirmed: 'bg-sky-50 text-sky-900 border-sky-200',
  processing: 'bg-blue-50 text-blue-900 border-blue-200',
  shipped: 'bg-violet-50 text-violet-900 border-violet-200',
  delivered: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  cancelled: 'bg-red-50 text-red-900 border-red-200',
  paid: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  failed: 'bg-red-50 text-red-900 border-red-200',
};

type AdminStatusBadgeProps = {
  status: string;
  className?: string;
};

const AdminStatusBadge = ({ status, className }: AdminStatusBadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center px-2 py-0.5 text-[8px] font-bold tracking-[0.12em] uppercase border',
      STATUS_STYLES[status] || 'bg-black/5 text-black/60 border-black/10',
      className
    )}
  >
    {status}
  </span>
);

export default AdminStatusBadge;
