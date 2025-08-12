import Header from '@/components/navigation/Header';
import Hero from '@/components/sections/Hero';
import Story from '@/components/sections/Story';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/scroll-to-top';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Story />
        <FeaturedProducts />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
