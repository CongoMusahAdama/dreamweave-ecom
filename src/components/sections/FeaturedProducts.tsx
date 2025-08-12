import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const FeaturedProducts = () => {
  // Placeholder products - these will come from Supabase once connected
  const featuredProducts = [
    {
      id: 1,
      name: "Dream Hoodie",
      price: "₵150",
      image: "/lovable-uploads/4612cdc2-c834-4bca-96a1-d73391c23439.png",
      hoverImage: "/lovable-uploads/44a15bbd-361a-4df5-8eef-e8d168d56d3e.png"
    },
    {
      id: 2,
      name: "Vision Tee",
      price: "₵85",
      image: "/lovable-uploads/f5d50ca7-4513-4a16-8d89-1529c33c6ada.png",
      hoverImage: "/lovable-uploads/588488c4-1f02-4461-8bea-64b6c0de61a1.png"
    },
    {
      id: 3,
      name: "Hustle Joggers",
      price: "₵120",
      image: "/lovable-uploads/228d5180-0a9a-4507-9a32-0bb021c9b4d1.png",
      hoverImage: "/lovable-uploads/4612cdc2-c834-4bca-96a1-d73391c23439.png"
    },
    {
      id: 4,
      name: "Ambition Cap",
      price: "₵65",
      image: "/lovable-uploads/588488c4-1f02-4461-8bea-64b6c0de61a1.png",
      hoverImage: "/lovable-uploads/f5d50ca7-4513-4a16-8d89-1529c33c6ada.png"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in">
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
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
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
            onClick={() => window.location.href = '/gallery'}
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