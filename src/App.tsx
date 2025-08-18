import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useState } from 'react';
import AuthModal from './components/auth/AuthModal';

// Import pages
import Home from './pages/Index';
import Products from './pages/Products';
import Gallery from './pages/Gallery';
import AdminDashboard from './admin/pages/Dashboard';
import AdminProducts from './admin/pages/Products';
import AdminOrders from './admin/pages/Orders';
import AdminCustomers from './admin/pages/Customers';
import AdminAnalytics from './admin/pages/Analytics';
import AdminSettings from './admin/pages/Settings';

// Import components
import Header from './components/navigation/Header';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ui/error-boundary';

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }: { 
  children: React.ReactNode; 
  requireAuth?: boolean; 
  requireAdmin?: boolean; 
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access this page</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-army-green hover:bg-army-green/90 text-white px-6 py-3 rounded-lg font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(token, user) => {
            // This will be handled by the AuthContext
          }}
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

  const handleAuthSuccess = (token: string, user: any) => {
    login(token, user);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <ErrorBoundary>
        <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
              
              {/* Protected Routes */}
              <Route 
                path="/products" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Products />
                  </ProtectedRoute>
                } 
              />
              
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
                path="/admin/customers" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminCustomers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          </ErrorBoundary>
        </main>
        
        <Footer />
        
        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
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
