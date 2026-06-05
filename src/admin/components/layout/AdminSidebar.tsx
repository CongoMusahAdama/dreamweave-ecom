import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Images,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Overview', short: 'Home', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', short: 'Orders', icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', short: 'Stock', icon: Package },
  { href: '/admin/gallery', label: 'Gallery', short: 'Photos', icon: Images },
];

function getInitials(name?: string) {
  if (!name?.trim()) return 'AD';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type AdminSidebarProps = {
  userName?: string;
  userEmail?: string;
  orderCount?: number;
  productCount?: number;
  onSignOut: () => void;
};

const AdminSidebar = ({
  userName,
  userEmail,
  orderCount = 0,
  productCount = 0,
  onSignOut,
}: AdminSidebarProps) => {
  const location = useLocation();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0">
      <div className="lg:sticky lg:top-[14rem] flex flex-col">
        <div className="mb-4 sm:mb-6 lg:mb-8 p-4 sm:p-5 border border-black/10 bg-black/[0.02]">
          <div className="flex items-start gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-black bg-black text-[10px] font-bold tracking-[0.06em] text-white"
              aria-hidden
            >
              {getInitials(userName)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-black/40">
                  Admin
                </p>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="shrink-0 inline-flex items-center gap-1 text-[8px] font-bold tracking-[0.12em] uppercase text-red-600 hover:text-red-700 min-h-[32px] px-1 -mr-1 lg:hidden"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
                  <span className="hidden min-[380px]:inline">Sign out</span>
                </button>
              </div>
              <p className="text-[11px] sm:text-[12px] font-bold tracking-[0.06em] uppercase text-black leading-snug mt-1 line-clamp-2">
                {userName || 'Administrator'}
              </p>
              <p className="text-[9px] font-bold text-black/45 mt-0.5 break-all line-clamp-2">
                {userEmail}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-black/10">
            <div className="text-center py-1">
              <p className="text-xl sm:text-lg font-bold tabular-nums">{orderCount}</p>
              <p className="text-[8px] font-bold tracking-[0.15em] uppercase text-black/40 mt-0.5">
                Orders
              </p>
            </div>
            <div className="text-center py-1 border-l border-black/10">
              <p className="text-xl sm:text-lg font-bold tabular-nums">{productCount}</p>
              <p className="text-[8px] font-bold tracking-[0.15em] uppercase text-black/40 mt-0.5">
                Products
              </p>
            </div>
          </div>
        </div>

        <nav
          className="grid grid-cols-4 gap-2 lg:flex lg:flex-col lg:gap-2"
          aria-label="Admin sections"
        >
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1.5 lg:gap-3',
                  'text-center lg:text-left px-2 py-3.5 lg:px-4 min-h-[64px] lg:min-h-[48px]',
                  'text-[9px] lg:text-[10px] font-bold tracking-[0.14em] lg:tracking-[0.18em] uppercase transition-colors border',
                  active
                    ? 'bg-black text-white border-black'
                    : 'text-black/55 hover:text-black border-black/10 hover:border-black/30 bg-white active:bg-black/[0.03]'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                <span className="lg:hidden leading-tight">{item.short}</span>
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 lg:mt-6">
          <Link
            to="/products"
            className="flex items-center justify-center lg:justify-start w-full gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 hover:text-black transition-colors min-h-[44px] lg:min-h-[48px]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View storefront
          </Link>
        </div>

        <div className="hidden lg:block mt-8 pt-6 border-t border-black/10">
          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center justify-start gap-2 min-h-[48px] text-[10px] font-bold tracking-[0.18em] uppercase text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={2} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
