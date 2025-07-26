import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/20 to-army-green/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(75,83,32,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            DREAM
            <span className="block text-army-green">BOLDLY</span>
            <span className="block">WEAR DREAMS</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Ghanaian streetwear that tells your story. Bold designs, premium quality, 
            and the courage to chase dreams.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-army-green text-primary-foreground px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 group"
            >
              Shop Collection
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-army-green text-army-green hover:bg-army-green hover:text-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Explore Dreams
            </Button>
          </div>
          
          {/* Stats or Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-2xl font-bold text-army-green mb-2">100%</div>
              <div className="text-sm text-muted-foreground">AUTHENTIC DESIGNS</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-2xl font-bold text-army-green mb-2">GHANA</div>
              <div className="text-sm text-muted-foreground">PROUDLY MADE</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-2xl font-bold text-army-green mb-2">∞</div>
              <div className="text-sm text-muted-foreground">DREAM POSSIBILITIES</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-army-green rounded-full flex justify-center">
          <div className="w-1 h-3 bg-army-green rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;