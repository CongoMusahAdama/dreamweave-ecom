import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';

const HERO_IMAGE = '/lovable-uploads/1a92e154-86f8-492d-b1ac-9e03726763f5.png';

const Hero = () => {
  return (
    <section className="bg-white w-full pt-[6.5rem] sm:pt-[7.5rem] md:pt-[14.5rem] lg:pt-[16rem] overflow-x-hidden">
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-10 pb-10 sm:pb-12 md:pb-16 lg:pb-20">
        <figure className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[5/4] max-h-[min(78vh,820px)] overflow-hidden bg-[#f0f0f0]">
          <img
            src={HERO_IMAGE}
            alt="HARV DREAMS campaign"
            className="hero-image-live h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

          <figcaption className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-10 lg:p-12 text-left">
            <ScrollReveal variant="fade-up" delay={100}>
              <p className="label-caps text-white/70 mb-3 sm:mb-4">Est. 2024 • Accra, Ghana</p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={180}>
              <h1 className="heading-display text-lg sm:text-2xl md:text-3xl text-white mb-1 sm:mb-2">
                Dream Boldly,
              </h1>
              <h1 className="heading-display text-lg sm:text-2xl md:text-3xl text-white/85 mb-4 sm:mb-5">
                Wear Dreams.
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={260}>
              <p className="text-[11px] sm:text-[12px] font-bold text-white/85 max-w-md mb-6 sm:mb-8 leading-[1.7]">
                Curated streetwear from Takoradi. Built for dreamers who refuse to settle.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={340}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link to="/products" className="w-full sm:w-auto">
                  <button type="button" className="btn-premium w-full sm:w-auto">
                    Shop Collection
                  </button>
                </Link>
                <Link
                  to="/gallery"
                  className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/85 hover:text-white py-3 text-center sm:text-left transition-colors"
                >
                  Explore Gallery →
                </Link>
              </div>
            </ScrollReveal>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default Hero;
