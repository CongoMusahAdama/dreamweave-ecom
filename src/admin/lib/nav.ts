import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Images,
  FileText,
  type LucideIcon,
} from 'lucide-react';

export type AdminNavItem = {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
  exact?: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: '/admin', label: 'Overview', short: 'Home', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Manage orders', short: 'Orders', icon: ShoppingCart },
  { href: '/admin/receipts', label: 'Order receipts', short: 'Receipts', icon: FileText },
  { href: '/admin/products', label: 'Product catalog', short: 'Stock', icon: Package },
  { href: '/admin/gallery', label: 'Site gallery', short: 'Photos', icon: Images },
];

export function isAdminNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname.startsWith(href);
}
