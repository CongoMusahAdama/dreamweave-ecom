import Header from '@/components/navigation/Header';
import Hero from '@/components/sections/Hero';
import ImageSlider from '@/components/sections/ImageSlider';
import Story from '@/components/sections/Story';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/scroll-to-top';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="transparent" />
      <main className="pt-0">
        <Hero />
        <div className="relative z-10 bg-background">
          <Story />
          <FeaturedProducts />
          <ImageSlider />
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
