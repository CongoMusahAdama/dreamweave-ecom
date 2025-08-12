import { useState } from 'react';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/scroll-to-top';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Gallery = () => {
  const [filter, setFilter] = useState('all');

  const products = [
    {
      id: 1,
      name: "Classic Dreams Tee",
      price: "₵45",
      image: "/lovable-uploads/44a15bbd-361a-4df5-8eef-e8d168d56d3e.png",
      category: "tees",
      type: "product"
    },
    {
      id: 2,
      name: "HARV DREAMS Baseball Tee",
      price: "₵65",
      image: "/lovable-uploads/f5d50ca7-4513-4a16-8d89-1529c33c6ada.png",
      category: "tees",
      type: "product"
    },
    {
      id: 3,
      name: "Vision Cap & Tee",
      price: "₵85",
      image: "/lovable-uploads/588488c4-1f02-4461-8bea-64b6c0de61a1.png",
      category: "tees",
      type: "product"
    },
    {
      id: 4,
      name: "Street Dreams Jersey",
      price: "₵75",
      image: "/lovable-uploads/228d5180-0a9a-4507-9a32-0bb021c9b4d1.png",
      category: "jerseys",
      type: "product"
    },
    {
      id: 5,
      name: "Urban Vision",
      image: "/lovable-uploads/088d637d-0061-45e6-94fd-3c2aba6d8cd2.png",
      category: "lifestyle",
      type: "lifestyle",
      caption: "Dreaming bold in the streets of Ghana"
    },
    {
      id: 6,
      name: "Street Style",
      image: "/lovable-uploads/44a15bbd-361a-4df5-8eef-e8d168d56d3e.png",
      category: "lifestyle", 
      type: "lifestyle",
      caption: "Living the dream in industrial Ghana"
    }
  ];

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'tees', label: 'T-Shirts' },
    { key: 'jerseys', label: 'Jerseys' },
    { key: 'lifestyle', label: 'Lifestyle' }
  ];

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.category === filter);

  const handleAddToCart = (productId: number) => {
    // TODO: Implement cart functionality
    console.log('Added to cart:', productId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in">
                Gallery
              </h1>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Discover our complete collection of streetwear and see how dreamers style HARV DREAMS
              </p>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={filter === category.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(category.key)}
                  className="transition-all duration-200"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((item) => (
                <div key={item.id} className="group">
                  <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.type === 'lifestyle' && (
                        <Badge className="absolute top-2 left-2 bg-army-green text-white">
                          Lifestyle
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2 text-sm">
                        {item.name}
                      </h3>
                      
                      {item.type === 'product' ? (
                        <>
                          <p className="text-army-green font-bold mb-3 text-sm">
                            {item.price}
                          </p>
                          <Button
                            size="sm"
                            className="w-full bg-primary hover:bg-army-green text-xs"
                            onClick={() => handleAddToCart(item.id)}
                          >
                            Add to Cart
                          </Button>
                        </>
                      ) : (
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Gallery;