import Header from '@/components/navigation/Header';
import Hero from '@/components/sections/Hero';
import Story from '@/components/sections/Story';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import Footer from '@/components/layout/Footer';

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
    </div>
  );
};

export default Index;
