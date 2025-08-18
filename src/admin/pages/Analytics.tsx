import AdminLayout from '../components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

const Analytics = () => {
  const analyticsData = {
    salesGrowth: '0%',
    orderGrowth: '0%',
    customerGrowth: '0%',
    productViews: '0%',
    topProducts: [],
    recentActivity: [],
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sales Growth</p>
                <p className="text-2xl font-bold text-gray-600">{analyticsData.salesGrowth}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Order Growth</p>
                <p className="text-2xl font-bold text-gray-600">{analyticsData.orderGrowth}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Growth</p>
                <p className="text-2xl font-bold text-gray-600">{analyticsData.customerGrowth}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Product Views</p>
                <p className="text-2xl font-bold text-gray-600">{analyticsData.productViews}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Package className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
            {analyticsData.topProducts.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No product data available</p>
                <p className="text-sm text-gray-400 mt-2">Product analytics will appear here once you have sales</p>
              </div>
            )}
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            {analyticsData.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'order' ? 'bg-blue-500' :
                      activity.type === 'product' ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400 mt-2">Activity will appear here as your business grows</p>
              </div>
            )}
          </Card>
        </div>

        {/* Placeholder for Charts */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Chart visualization coming soon...</p>
              <p className="text-sm text-gray-400 mt-2">Sales data will be displayed here</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
