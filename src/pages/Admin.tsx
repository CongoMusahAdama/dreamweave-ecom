import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, DollarSign, Users, TrendingUp } from 'lucide-react';

const Admin = () => {
  const [products] = useState([
    { id: 1, name: "Dream Hoodie", price: "₵150", stock: 45, sales: 23 },
    { id: 2, name: "Vision Tee", price: "₵85", stock: 67, sales: 89 },
    { id: 3, name: "Hustle Joggers", price: "₵120", stock: 23, sales: 34 },
    { id: 4, name: "Ambition Cap", price: "₵65", stock: 78, sales: 56 }
  ]);

  const [orders] = useState([
    { id: "ORD001", customer: "John Doe", total: "₵235", status: "Completed", date: "2025-01-12" },
    { id: "ORD002", customer: "Jane Smith", total: "₵150", status: "Processing", date: "2025-01-12" },
    { id: "ORD003", customer: "Mike Johnson", total: "₵85", status: "Shipped", date: "2025-01-11" }
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 animate-fade-in">
            HARV DREAMS Admin Dashboard
          </h1>
          <p className="text-muted-foreground animate-fade-in">
            Manage your products, orders, and sales analytics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₵12,450</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <p className="text-2xl font-bold">+24%</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold animate-fade-in">Product Management</h2>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id} className="p-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg"></div>
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-muted-foreground">{product.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Stock</p>
                        <p className="font-semibold">{product.stock}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Sales</p>
                        <p className="font-semibold">{product.sales}</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold animate-fade-in">Order Management</h2>
            
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{order.id}</h3>
                      <p className="text-muted-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="font-semibold">{order.total}</p>
                      <Badge variant={order.status === 'Completed' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add-product" className="space-y-6">
            <h2 className="text-2xl font-bold animate-fade-in">Add New Product</h2>
            
            <Card className="p-6 animate-fade-in">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name</label>
                    <Input placeholder="Enter product name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (₵)</label>
                    <Input placeholder="Enter price" type="number" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Enter product description" rows={4} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock Quantity</label>
                    <Input placeholder="Enter stock quantity" type="number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Input placeholder="Enter category" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Images</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">Click to upload or drag and drop images</p>
                  </div>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Add Product
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;