import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const FeaturedProducts = () => {
  // Placeholder products - these will come from Supabase once connected
  const featuredProducts = [
    {
      id: 1,
      name: "Dream Manifest Hoodie",
      price: "₵250",
      image: "/api/placeholder/400/500",
      hoverImage: "/api/placeholder/400/500"
    },
    {
      id: 2,
      name: "Vision Tee - Black",
      price: "₵120",
      image: "/api/placeholder/400/500",
      hoverImage: "/api/placeholder/400/500"
    },
    {
      id: 3,
      name: "Chase Dreams Cap",
      price: "₵80",
      image: "/api/placeholder/400/500",
      hoverImage: "/api/placeholder/400/500"
    },
    {
      id: 4,
      name: "Hustle Hard Crewneck",
      price: "₵200",
      image: "/api/placeholder/400/500",
      hoverImage: "/api/placeholder/400/500"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            FEATURED <span className="text-army-green">DREAMS</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked pieces that embody the spirit of chasing dreams and 
            living authentically.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className="group cursor-pointer border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2 animate-slide-up bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg aspect-[4/5] bg-muted">
                  <div className="w-full h-full bg-gradient-to-br from-muted to-army-green/10 flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Product Image</div>
                  </div>
                  
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-white text-primary hover:bg-white/90"
                    >
                      Quick View
                    </Button>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-army-green transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-army-green">
                    {product.price}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline"
            className="border-army-green text-army-green hover:bg-army-green hover:text-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 group"
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;