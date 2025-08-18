import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/scroll-to-top';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, ShoppingCart, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: string;
  frontImage: string;
  backImage: string;
  size: string;
  quantity: number;
}

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: number]: number }>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Product Categories
  const categories = [
    { key: 'all', label: 'All Products' },
    { key: 'hoodies', label: 'Hoodies' },
    { key: 'tees', label: 'T-Shirts' },
    { key: 'jerseys', label: 'Jerseys' },
    { key: 'caps', label: 'Caps' },
    { key: 'accessories', label: 'Accessories' }
  ];

  // New Collections - Products in stock
  const newCollections = [
    {
      id: 1,
      name: "Dream Hoodie",
      price: "₵150",
      frontImage: "/lovable-uploads/4612cdc2-c834-4bca-96a1-d73391c23439.png",
      backImage: "/lovable-uploads/44a15bbd-361a-4df5-8eef-e8d168d56d3e.png",
      category: "hoodies",
      stock: 25,
      sizes: ['S', 'M', 'L', 'XL'],
      description: "Premium cotton hoodie with bold HARV DREAMS branding"
    },
    {
      id: 2,
      name: "Vision Tee",
      price: "₵85",
      frontImage: "/lovable-uploads/f5d50ca7-4513-4a16-8d89-1529c33c6ada.png",
      backImage: "/lovable-uploads/588488c4-1f02-4461-8bea-64b6c0de61a1.png",
      category: "tees",
      stock: 42,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      description: "Classic fit t-shirt with visionary design"
    },
    {
      id: 3,
      name: "Street Dreams Jersey",
      price: "₵120",
      frontImage: "/lovable-uploads/228d5180-0a9a-4507-9a32-0bb021c9b4d1.png",
      backImage: "/lovable-uploads/4612cdc2-c834-4bca-96a1-d73391c23439.png",
      category: "jerseys",
      stock: 18,
      sizes: ['M', 'L', 'XL', 'XXL'],
      description: "Athletic jersey perfect for street style"
    },
    {
      id: 4,
      name: "Ambition Cap",
      price: "₵65",
      frontImage: "/lovable-uploads/588488c4-1f02-4461-8bea-64b6c0de61a1.png",
      backImage: "/lovable-uploads/f5d50ca7-4513-4a16-8d89-1529c33c6ada.png",
      category: "caps",
      stock: 35,
      sizes: ['One Size'],
      description: "Embroidered cap with HARV DREAMS logo"
    },
    {
      id: 5,
      name: "Classic Dreams Tee",
      price: "₵75",
      frontImage: "/lovable-uploads/44a15bbd-361a-4df5-8eef-e8d168d56d3e.png",
      backImage: "/lovable-uploads/f5d50ca7-4513-4a16-8d89-1529c33c6ada.png",
      category: "tees",
      stock: 30,
      sizes: ['S', 'M', 'L', 'XL'],
      description: "Essential t-shirt with dream-inspired graphics"
    },
    {
      id: 6,
      name: "Urban Vision Hoodie",
      price: "₵140",
      frontImage: "/lovable-uploads/088d637d-0061-45e6-94fd-3c2aba6d8cd2.png",
      backImage: "/lovable-uploads/4612cdc2-c834-4bca-96a1-d73391c23439.png",
      category: "hoodies",
      stock: 22,
      sizes: ['M', 'L', 'XL'],
      description: "Urban streetwear hoodie with bold graphics"
    }
  ];

  const filteredProducts = newCollections
    .filter(product => {
      // Filter by category
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
      
      // Filter by search query
      const searchMatch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && searchMatch;
    });

  const handleAddToCart = (productId: number) => {
    const selectedSize = selectedSizes[productId];
    const selectedQuantity = selectedQuantities[productId] || 1;
    
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const product = newCollections.find(p => p.id === productId);
    if (!product) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId && item.size === selectedSize);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map(item => 
          item.id === productId && item.size === selectedSize
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        );
      } else {
        // Add new item
        return [...prevCart, {
          id: productId,
          name: product.name,
          price: product.price,
          frontImage: product.frontImage,
          backImage: product.backImage,
          size: selectedSize,
          quantity: selectedQuantity
        }];
      }
    });

    // Clear the selections for this product
    setSelectedSizes(prev => {
      const newSizes = { ...prev };
      delete newSizes[productId];
      return newSizes;
    });
    
    setSelectedQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[productId];
      return newQuantities;
    });

    // Show success message
    alert(`${product.name} (${selectedSize}) x${selectedQuantity} added to cart!`);
  };

  const handleSizeChange = (productId: number, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, quantity)
    }));
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-500' };
    if (stock <= 5) return { text: `Only ${stock} left`, color: 'bg-orange-500' };
    return { text: `${stock} in stock`, color: 'bg-green-500' };
  };

  const updateCartItemQuantity = (itemId: number, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, size);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (itemId: number, size: string) => {
    setCart(prevCart => 
      prevCart.filter(item => !(item.id === itemId && item.size === size))
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace('₵', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    alert('Checkout functionality coming soon!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header variant="solid" />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in">
                Products
              </h1>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Discover our complete collection of streetwear. All products are in stock and ready to ship.
              </p>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center animate-fade-in">
              Product Categories
            </h2>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key)}
                  className="transition-all duration-200"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* New Collections */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center animate-fade-in">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'New Collections'}
            </h2>
            {searchQuery && (
              <p className="text-center text-muted-foreground mb-6 animate-fade-in">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => {
                const stockStatus = getStockStatus(product.stock);
                const selectedSize = selectedSizes[product.id] || '';
                
                return (
                  <div key={product.id} className="group animate-fade-in" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                    <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                                                    <div className="aspect-square overflow-hidden relative group perspective-1000">
                          {/* Container for 3D rotation */}
                          <div className="relative w-full h-full transition-transform duration-700 ease-in-out group-hover:rotate-y-180 transform-style-preserve-3d">
                            {/* Front Image */}
                            <div className="absolute inset-0 w-full h-full backface-hidden">
                              <img
                                src={product.frontImage}
                                alt={`${product.name} - Front View`}
                                className="w-full h-full object-cover"
                              />
                              {/* Front View Indicator */}
                              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                FRONT
                              </div>
                            </div>
                            
                            {/* Back Image */}
                            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                              <img
                                src={product.backImage}
                                alt={`${product.name} - Back View`}
                                className="w-full h-full object-cover"
                              />
                              {/* Back View Indicator */}
                              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                BACK
                              </div>
                            </div>
                          </div>
                        
                        {/* Stock Status Badge */}
                        <Badge className={`absolute top-2 left-2 ${stockStatus.color} text-white`}>
                          {stockStatus.text}
                        </Badge>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-2 text-sm">
                          {product.name}
                        </h3>
                        
                        <p className="text-muted-foreground text-xs mb-3 leading-relaxed">
                          {product.description}
                        </p>
                        
                        <p className="text-lg font-bold text-army-green mb-3">
                          {product.price}
                        </p>

                        {/* Size Selection */}
                        <div className="mb-3">
                          <label className="text-xs font-medium text-muted-foreground mb-2 block">
                            Size
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeChange(product.id, size)}
                                className={`px-3 py-1 text-xs border rounded transition-colors ${
                                  selectedSize === size
                                    ? 'bg-army-green text-white border-army-green'
                                    : 'bg-transparent text-muted-foreground border-muted-foreground hover:border-army-green hover:text-army-green'
                                }`}
                              >
                                  {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quantity Selection */}
                        <div className="mb-3">
                          <label className="text-xs font-medium text-muted-foreground mb-2 block">
                            Quantity
                          </label>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(product.id, (selectedQuantities[product.id] || 1) - 1)}
                              className="h-8 w-8"
                              disabled={(selectedQuantities[product.id] || 1) <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">
                              {selectedQuantities[product.id] || 1}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(product.id, (selectedQuantities[product.id] || 1) + 1)}
                              className="h-8 w-8"
                              disabled={(selectedQuantities[product.id] || 1) >= product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={!selectedSize || product.stock === 0}
                          className="w-full bg-army-green hover:bg-army-green/90"
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${index}`} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <img
                      src={item.frontImage}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                      <p className="text-sm font-semibold text-army-green">{item.price}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateCartItemQuantity(item.id, item.size, item.quantity - 1)}
                          className="h-6 w-6"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateCartItemQuantity(item.id, item.size, item.quantity + 1)}
                          className="h-6 w-6"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-lg font-bold text-army-green">₵{getCartTotal()}</span>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full bg-army-green hover:bg-army-green/90"
              >
                Checkout ({getCartItemCount()} items)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Floating Cart Button */}
      <Button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-army-green hover:bg-army-green/90 shadow-lg z-30"
        size="icon"
      >
        <ShoppingCart className="h-6 w-6" />
        {getCartItemCount() > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {getCartItemCount()}
          </Badge>
        )}
      </Button>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Products;


