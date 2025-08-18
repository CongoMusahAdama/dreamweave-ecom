import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/scroll-to-top';
import ErrorBoundary from '@/components/ui/error-boundary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GalleryItem {
  id: number;
  name: string;
  image: string;
  category: string;
  caption: string;
}

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const lifestyleImages: GalleryItem[] = [
    {
      id: 1,
      name: "Urban Vision",
      image: "/lovable-uploads/088d637d-0061-45e6-94fd-3c2aba6d8cd2.png",
      category: "lifestyle",
      caption: "Dreaming bold in the streets of Ghana"
    },
    {
      id: 2,
      name: "Street Style",
      image: "/lovable-uploads/44a15bbd-361a-4df5-8eef-e8d168d56d3e.png",
      category: "lifestyle",
      caption: "Living the dream in industrial Ghana"
    },
    {
      id: 3,
      name: "Dream Hoodie",
      image: "/lovable-uploads/4612cdc2-c834-4bca-96a1-d73391c23439.png",
      category: "hoodies",
      caption: "Premium cotton hoodie with bold HARV DREAMS branding"
    },
    {
      id: 4,
      name: "Vision Tee",
      image: "/lovable-uploads/f5d50ca7-4513-4a16-8d89-1529c33c6ada.png",
      category: "tees",
      caption: "Classic fit t-shirt with visionary design"
    },
    {
      id: 5,
      name: "Street Dreams Jersey",
      image: "/lovable-uploads/228d5180-0a9a-4507-9a32-0bb021c9b4d1.png",
      category: "jerseys",
      caption: "Athletic jersey perfect for street style"
    },
    {
      id: 6,
      name: "Ambition Cap",
      image: "/lovable-uploads/588488c4-1f02-4461-8bea-64b6c0de61a1.png",
      category: "caps",
      caption: "Embroidered cap with HARV DREAMS logo"
    }
  ];

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'lifestyle', label: 'Lifestyle' },
    { key: 'hoodies', label: 'Hoodies' },
    { key: 'tees', label: 'T-Shirts' },
    { key: 'jerseys', label: 'Jerseys' },
    { key: 'caps', label: 'Caps' }
  ];

  const filteredImages = filter === 'all' 
    ? lifestyleImages 
    : lifestyleImages.filter(image => image.category === filter);

  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
  }, []);

  const handleShopClick = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header variant="solid" />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-12 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in">
                  Gallery
                </h1>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  See how dreamers style HARV DREAMS. Real people, real style, real dreams.
                </p>
              </div>
            </div>
          </section>

          {/* Filter Tabs */}
          <section className="py-8 border-b">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {categories.map((category) => (
                  <Button
                    key={category.key}
                    variant={filter === category.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange(category.key)}
                    className="transition-all duration-200"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Lifestyle Images Grid */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredImages.map((item, index) => (
                  <div key={item.id} className="group animate-fade-in" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                    <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2">
                      <div className="aspect-[4/5] overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        
                        {/* Category Badge */}
                        <Badge className="absolute top-4 left-4 bg-army-green text-white">
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </Badge>
                        
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-6 text-white">
                            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                            <p className="text-sm text-white/90 leading-relaxed">
                              {item.caption}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-semibold text-foreground mb-2 text-lg">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 animate-fade-in">
                Ready to Rock HARV DREAMS?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Join the community of dreamers who wear their vision with confidence.
              </p>
              <Button 
                size="lg" 
                className="bg-army-green hover:bg-army-green/90 text-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: '0.4s' }}
                onClick={handleShopClick}
              >
                Shop the Collection
              </Button>
            </div>
          </section>
        </main>
        
        <Footer />
        <ScrollToTop />
      </div>
    </ErrorBoundary>
  );
};

export default Gallery;