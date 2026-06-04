import { ReactNode, useState } from 'react';
import ShopHeader from '@/components/navigation/ShopHeader';
import Footer from '@/components/layout/Footer';
import SignOutConfirmDialog from '@/components/account/SignOutConfirmDialog';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { SHOP_HEADER_OFFSET_PT, PAGE_X } from '@/lib/page-layout';
import { cn } from '@/lib/utils';

type AdminLayoutProps = {
  children: ReactNode;
  orderCount?: number;
  productCount?: number;
};

const AdminLayout = ({ children, orderCount = 0, productCount = 0 }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [signOutOpen, setSignOutOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    setSignOutOpen(false);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <ShopHeader cartCount={cartCount} />

      <main className={cn(SHOP_HEADER_OFFSET_PT, 'pb-20 sm:pb-16', PAGE_X)}>
        <div className="w-full max-w-6xl mx-auto py-3 sm:py-8">
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:gap-10 xl:gap-14">
            <AdminSidebar
              userName={user?.name}
              userEmail={user?.email}
              orderCount={orderCount}
              productCount={productCount}
              onSignOut={() => setSignOutOpen(true)}
            />
            <div className="flex-1 min-w-0 lg:pt-2">{children}</div>
          </div>
        </div>
      </main>

      <SignOutConfirmDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        onConfirm={handleSignOut}
      />

      <Footer />
    </div>
  );
};

export default AdminLayout;
