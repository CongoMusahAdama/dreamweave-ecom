import Header from '@/components/navigation/Header';
import Hero from '@/components/sections/Hero';
import Story from '@/components/sections/Story';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import Newsletter from '@/components/sections/Newsletter';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Story />
        <FeaturedProducts />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
