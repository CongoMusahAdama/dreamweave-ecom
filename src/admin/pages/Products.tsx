import { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { AdminProduct } from '../types/admin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, Trash2, Eye, Upload, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: 0,
    frontImage: null as File | null,
    backImage: null as File | null,
  });

  // Initialize with empty products array for real database
  useEffect(() => {
    setProducts([]);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'hoodies', 'tees', 'jerseys', 'caps', 'accessories'];

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 5) return { text: `Low Stock (${stock})`, color: 'bg-orange-100 text-orange-800' };
    return { text: `In Stock (${stock})`, color: 'bg-green-100 text-green-800' };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct(prev => ({
        ...prev,
        [type === 'front' ? 'frontImage' : 'backImage']: file
      }));
    }
  };

  const removeImage = (type: 'front' | 'back') => {
    setNewProduct(prev => ({
      ...prev,
      [type === 'front' ? 'frontImage' : 'backImage']: null
    }));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.frontImage || !newProduct.backImage) {
      alert('Please fill in all required fields and upload both images');
      return;
    }

    const product: AdminProduct = {
      id: Date.now(), // Temporary ID for demo
      name: newProduct.name,
      price: `₵${newProduct.price}`,
      frontImage: URL.createObjectURL(newProduct.frontImage),
      backImage: URL.createObjectURL(newProduct.backImage),
      category: newProduct.category,
      stock: newProduct.stock,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: 0,
      frontImage: null,
      backImage: null,
    });
    setShowAddForm(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Button 
            className="bg-army-green hover:bg-army-green/90"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Product</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="productPrice">Price (₵) *</Label>
                  <Input
                    id="productPrice"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Enter price"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="productDescription">Description</Label>
                <Textarea
                  id="productDescription"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="productCategory">Category *</Label>
                  <select
                    id="productCategory"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    aria-label="Select product category"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="tees">Tees</option>
                    <option value="jerseys">Jerseys</option>
                    <option value="caps">Caps</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="productStock">Stock Quantity</Label>
                  <Input
                    id="productStock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    placeholder="Enter stock quantity"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Product Images *</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Front Image */}
                  <div>
                    <Label>Front Image *</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {newProduct.frontImage ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(newProduct.frontImage)}
                            alt="Front preview"
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removeImage('front')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Upload front image</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'front')}
                            className="hidden"
                            id="frontImage"
                            required
                          />
                          <label htmlFor="frontImage" className="mt-2 cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                            Choose file
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Back Image */}
                  <div>
                    <Label>Back Image *</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {newProduct.backImage ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(newProduct.backImage)}
                            alt="Back preview"
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removeImage('back')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Upload back image</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'back')}
                            className="hidden"
                            id="backImage"
                            required
                          />
                          <label htmlFor="backImage" className="mt-2 cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                            Choose file
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-army-green hover:bg-army-green/90">
                  Add Product
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  {/* Product Image */}
                  <div className="aspect-square relative group">
                    <img
                      src={product.frontImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className={stockStatus.color}>
                        {stockStatus.text}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 capitalize">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-army-green">{product.price}</span>
                      <span className="text-sm text-gray-500">
                        Updated {new Date(product.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
            {products.length === 0 && (
              <p className="text-sm text-gray-400 mt-2">Start by adding your first product</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;
