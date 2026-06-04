import type { ShopOrder } from '@/types/customer';

export interface AdminStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentSales: number;
  lowStockProducts: number;
}

export type PopulatedCustomer = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
};

export interface AdminShopOrder extends ShopOrder {
  customer?: PopulatedCustomer | string;
}

export interface MongoProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  isActive?: boolean;
  images?: { front?: string; back?: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCustomer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface DashboardPayload {
  stats: AdminStats;
  recentOrders: AdminShopOrder[];
  lowStockProducts: { _id: string; name: string; stock: number; category: string }[];
}
