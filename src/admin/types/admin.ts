export interface AdminStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentSales: number;
  lowStockProducts: number;
}

export interface AdminProduct {
  id: number;
  name: string;
  price: string;
  frontImage: string;
  backImage: string;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  items: AdminOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: string;
  size: string;
}

export interface AdminCustomer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: string;
  lastOrderDate?: string;
  createdAt: string;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export interface ProductAnalytics {
  productId: number;
  productName: string;
  totalSold: number;
  revenue: number;
  views: number;
}
