import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
        <section 
      className="relative h-[70vh] md:h-[95vh] flex items-center justify-center overflow-hidden" 
      style={{ 
        marginTop: '-80px', 
        paddingTop: '0px',
        backgroundImage: 'url(/lovable-uploads/1a92e154-86f8-492d-b1ac-9e03726763f5.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 25%',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        zIndex: 0
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="container mx-auto px-4 relative z-10" style={{ paddingTop: '80px' }}>
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Heading - Positioned to avoid faces */}
          <div className="mb-6 md:mb-8 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              DREAM
            </h1>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in-out">
              BOLDLY
            </h1>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              WEAR DREAMS
            </h1>
          </div>
          
          {/* Subheading - Positioned below main heading */}
          <div className="mb-12 md:mb-16 animate-fade-in">
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed px-4">
              Ghanaian streetwear that tells your story. Bold designs, premium quality, 
              and the courage to chase dreams.
            </p>
          </div>
          
          {/* Stats or Features - Positioned at bottom to avoid faces */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto mt-auto">
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">100%</div>
              <div className="text-xs md:text-sm text-white/90 font-medium">AUTHENTIC DESIGNS</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">GHANA</div>
              <div className="text-xs md:text-sm text-white/90 font-medium">PROUDLY MADE</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">∞</div>
              <div className="text-xs md:text-sm text-white/90 font-medium">DREAM POSSIBILITIES</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;