import { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import StatsCards from '../components/dashboard/StatsCards';
import RecentOrders from '../components/dashboard/RecentOrders';
import { AdminStats, AdminOrder } from '../types/admin';

const Dashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentSales: 0,
    lowStockProducts: 0,
  });

  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);

  // Initialize with zero data for real database
  useEffect(() => {
    // All data starts at zero for new database
    setStats({
      totalSales: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      recentSales: 0,
      lowStockProducts: 0,
    });

    setRecentOrders([]);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your HARV DREAMS admin dashboard</p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <RecentOrders orders={recentOrders} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Add New Product</div>
                  <div className="text-sm text-gray-500">Create a new product listing</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">View Orders</div>
                  <div className="text-sm text-gray-500">Manage customer orders</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Analytics</div>
                  <div className="text-sm text-gray-500">View detailed reports</div>
                </button>
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alert</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.lowStockProducts}</div>
                <div className="text-sm text-gray-500">Products need restocking</div>
                <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
