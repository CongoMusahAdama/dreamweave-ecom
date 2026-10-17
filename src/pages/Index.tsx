import Header from '@/components/navigation/Header';
import Hero from '@/components/sections/Hero';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import NewArrivalsPopup from '@/components/sections/NewArrivalsPopup';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/scroll-to-top';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-black selection:text-white">
      <Header variant="solid" />
      <main>
        <h1 className="sr-only">HARV DREAMS — Bold Streetwear from Ghana</h1>
        <Hero />
        <FeaturedProducts />
      </main>
      <NewArrivalsPopup />
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
