import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -top-24">
        <img 
          src="/lovable-uploads/1a92e154-86f8-492d-b1ac-9e03726763f5.png" 
          alt="HARV DREAMS lifestyle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
            DREAM
            <span className="block text-foreground">BOLDLY</span>
            <span className="block">WEAR DREAMS</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-base md:text-lg text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Ghanaian streetwear that tells your story. Bold designs, premium quality, 
            and the courage to chase dreams.
          </p>
          
          {/* Stats or Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-xl font-bold text-white mb-2">100%</div>
              <div className="text-xs text-white/80">AUTHENTIC DESIGNS</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-xl font-bold text-white mb-2">GHANA</div>
              <div className="text-xs text-white/80">PROUDLY MADE</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-xl font-bold text-white mb-2">∞</div>
              <div className="text-xs text-white/80">DREAM POSSIBILITIES</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;