import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const campaignImages = [
    {
      id: 1,
      src: "/lovable-uploads/1a92e154-86f8-492d-b1ac-9e03726763f5.png",
      alt: "HARV DREAMS Campaign Shot 1",
      title: "DREAM BOLDLY",
      subtitle: "Live your vision"
    },
    {
      id: 2,
      src: "/lovable-uploads/4612cdc2-c834-4bca-96a1-d73391c23439.png",
      alt: "HARV DREAMS Campaign Shot 2",
      title: "WEAR DREAMS",
      subtitle: "Authentic streetwear"
    },
    {
      id: 3,
      src: "/lovable-uploads/f5d50ca7-4513-4a16-8d89-1529c33c6ada.png",
      alt: "HARV DREAMS Campaign Shot 3",
      title: "GHANA PRIDE",
      subtitle: "Proudly made"
    },
    {
      id: 4,
      src: "/lovable-uploads/228d5180-0a9a-4507-9a32-0bb021c9b4d1.png",
      alt: "HARV DREAMS Campaign Shot 4",
      title: "STREET STYLE",
      subtitle: "Urban culture"
    }
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % campaignImages.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + campaignImages.length) % campaignImages.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  // Auto-advance slides every 6 seconds with pause on hover
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const startInterval = () => {
      interval = setInterval(() => {
        if (!isTransitioning) {
          nextSlide();
        }
      }, 6000);
    };

    startInterval();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTransitioning) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextSlide();
          break;
        case ' ':
          event.preventDefault();
          nextSlide();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning]);

  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-black">
      <div className="container mx-auto px-4 h-full">
        <div className="max-w-4xl mx-auto h-full relative">
          {/* Slides */}
          <div className="relative h-full">
            {campaignImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
                
                {/* Slide Content */}
                <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-20 lg:pb-24">
                  <div className="text-center text-white z-10 px-6">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 tracking-wider animate-fade-in leading-tight">
                      {image.title}
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-white/95 font-medium tracking-wide animate-fade-in max-w-lg md:max-w-xl mx-auto" style={{ animationDelay: '0.3s' }}>
                      {image.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-110 w-10 h-10 md:w-12 md:h-12"
            onClick={prevSlide}
            disabled={isTransitioning}
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-110 w-10 h-10 md:w-12 md:h-12"
            onClick={nextSlide}
            disabled={isTransitioning}
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </Button>

          {/* Progress Bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000 ease-out"
              style={{ 
                width: `${((currentSlide + 1) / campaignImages.length) * 100}%` 
              }}
            />
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {campaignImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index === currentSlide 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/75 hover:scale-110'
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute bottom-4 right-4 text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
            {currentSlide + 1} / {campaignImages.length}
          </div>

          {/* Keyboard Navigation Hints */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-xs bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
            Use ← → keys or click to navigate
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;
