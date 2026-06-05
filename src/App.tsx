import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RouteScrollToTop from './components/ui/RouteScrollToTop';
import CartNavBridge from './components/shop/CartNavBridge';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ShopCatalogProvider } from './contexts/ShopCatalogContext';
import { PaystackProvider } from './contexts/PaystackContext';
import PaymentCallback from './pages/PaymentCallback';
import { useState } from 'react';
import AuthModal from './components/auth/AuthModal';

// Import pages
import Home from './pages/Index';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Shipping from './pages/Shipping';
import Privacy from './pages/Privacy';
import Account from './pages/Account';
import AdminDashboard from './admin/pages/Dashboard';
import AdminProducts from './admin/pages/Products';
import AdminOrders from './admin/pages/Orders';
import AdminGallery from './admin/pages/Gallery';
import AdminReceipts from './admin/pages/Receipts';

import ErrorBoundary from './components/ui/error-boundary';

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }: { 
  children: React.ReactNode; 
  requireAuth?: boolean; 
  requireAdmin?: boolean; 
}) => {
  const { isAuthenticated, isAdmin, loading, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-army-green"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
          <div className="text-center max-w-sm">
            <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-black mb-4">
              Sign in required
            </h2>
            <p className="text-[10px] font-bold text-black/50 mb-6 uppercase tracking-wider">
              Please sign in to access your account
            </p>
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="bg-black text-white px-8 py-3 text-[10px] font-bold tracking-[0.2em] uppercase"
            >
              Sign in
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={async (token, user) => {
            await login(token, user);
            setShowAuthModal(false);
          }}
          initialMode="login"
        />
      </>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page</p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Main App Component
const AppContent = () => {
  const { isAuthenticated, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = async (token: string, user: any) => {
    await login(token, user);
  };

  return (
    <Router>
      <RouteScrollToTop />
      <CartProvider>
      <ShopCatalogProvider>
      <PaystackProvider>
      <CartNavBridge />
      <Toaster />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <ErrorBoundary>
        <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Navigate to="/shipping#returns" replace />} />
          <Route path="/privacy" element={<Privacy />} />
              
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment/callback" element={<PaymentCallback />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Account />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes */}
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminOrders />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/admin/gallery"
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminGallery />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/receipts"
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminReceipts />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/customers" element={<Navigate to="/admin" replace />} />
              <Route path="/admin/analytics" element={<Navigate to="/admin" replace />} />
              <Route path="/admin/settings" element={<Navigate to="/admin" replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          </ErrorBoundary>
        </main>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
      </PaystackProvider>
      </ShopCatalogProvider>
      </CartProvider>
    </Router>
  );
};

// Root App Component with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
