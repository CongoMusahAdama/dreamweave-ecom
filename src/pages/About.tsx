import Header from '@/components/navigation/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/scroll-to-top';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="solid" />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 animate-fade-in">
                About HARV DREAMS
              </h1>
              <div className="text-base md:text-lg text-muted-foreground leading-relaxed space-y-6">
                <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <strong className="text-foreground">HARV DREAMS</strong> is a long-held vision that took a minute to come alive. 
                  The idea sparked 4 years back, but the timing wasn't right. We had to wait, plan, and move smart. 
                  In 2025, it finally dropped. Not just as a fashion label, but as a statement.
                </p>
                
                <p className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  This brand was built off the dreams of my younger self, the version of me that used to imagine big things 
                  even when the world felt small. <strong className="text-foreground">HARV DREAMS</strong> stands for every young person grinding in silence, 
                  dreaming wild, and refusing to settle.
                </p>
                
                <p className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  We don't just drop clothes, we drop energy. Every piece tells a story, carries a mindset, 
                  and speaks to those chasing what feels outta reach. This is for the ones who feel stuck 
                  but still believe they'll get there.
                </p>
                
                <p className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  <strong className="text-foreground">HARV DREAMS</strong> is street, it's real, and it's for the tough dreamers who never folded.
                </p>
                
                <div className="pt-8 animate-fade-in" style={{ animationDelay: '1s' }}>
                  <p className="text-army-green font-bold text-lg">
                    Live your vision!
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    ~harv.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 animate-fade-in">
                Meet the Founder
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="w-64 h-64 rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <img 
                    src="/lovable-uploads/4612cdc2-c834-4bca-96a1-d73391c23439.png"
                    alt="Charles Harvey - HARV DREAMS Founder"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <h3 className="text-xl font-bold text-foreground mb-2">Charles Harvey</h3>
                  <p className="text-muted-foreground mb-4">Founder & Creative Director</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Charles Harvey is the visionary behind HARV DREAMS, bringing dreams to life through 
                    authentic streetwear. Born and raised in Takoradi, Ghana, Charles has always believed 
                    in the power of dreams to transform lives and communities.
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12 animate-fade-in">
                What We Stand For
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="w-16 h-16 bg-army-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm">DREAM BIG</h3>
                  <p className="text-muted-foreground text-xs">
                    Every design starts with a bold vision that others might call impossible.
                  </p>
                </div>
                
                <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="w-16 h-16 bg-army-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm">STAY REAL</h3>
                  <p className="text-muted-foreground text-xs">
                    Authentic to the streets, honest about the struggle, real about the grind.
                  </p>
                </div>
                
                <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <div className="w-16 h-16 bg-army-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">N</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm">NEVER FOLD</h3>
                  <p className="text-muted-foreground text-xs">
                    When the world says quit, we say push harder. Resilience is our uniform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default About;