import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const Hero = () => {
  const { heroImageSrc, heroImageAlt } = useSiteSettings();

  return (
    <section className="bg-white w-full pt-[6.5rem] sm:pt-[7.5rem] md:pt-[14.5rem] lg:pt-[16rem] overflow-x-hidden">
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-10 pb-10 sm:pb-12 md:pb-16 lg:pb-20">
        <figure className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[5/4] max-h-[min(78vh,820px)] overflow-hidden bg-[#f0f0f0]">
          <img
            src={heroImageSrc}
            alt={heroImageAlt}
            className="hero-image-live h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          <figcaption className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-10 lg:p-12">
            <ScrollReveal variant="fade-up" delay={120}>
              <Link to="/products" className="block w-full sm:w-auto sm:inline-block">
                <button type="button" className="btn-premium w-full sm:w-auto">
                  Shop Collection
                </button>
              </Link>
            </ScrollReveal>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default Hero;
