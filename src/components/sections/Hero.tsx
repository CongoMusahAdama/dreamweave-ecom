import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { cn } from '@/lib/utils';

const Hero = () => {
  const { heroImageSrc, heroImageAlt, ready } = useSiteSettings();
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const imageVisible = ready && loadedSrc === heroImageSrc;

  // Browser-cached images can finish before React attaches onLoad
  useEffect(() => {
    const img = imgRef.current;
    if (ready && img?.complete && img.naturalWidth > 0) setLoadedSrc(heroImageSrc);
  }, [ready, heroImageSrc]);

  return (
    <section className="bg-white w-full pt-[6.5rem] sm:pt-[7.5rem] md:pt-[14.5rem] lg:pt-[16rem] overflow-x-hidden">
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-10 pb-10 sm:pb-12 md:pb-16 lg:pb-20">
        <figure className="relative w-full overflow-hidden bg-[#f0f0f0]">
          {/* Hold the space with a neutral block until the admin-chosen photo is ready —
              never flash the built-in default image first */}
          {!imageVisible && (
            <div className="w-full aspect-[4/5] sm:aspect-[16/11] max-h-[85vh] animate-pulse" aria-hidden />
          )}

          {ready && (
            <img
              ref={imgRef}
              src={heroImageSrc}
              alt={heroImageAlt}
              onLoad={() => setLoadedSrc(heroImageSrc)}
              className={cn(
                'hero-image-live block w-full h-auto max-h-[85vh] transition-opacity duration-700 ease-out',
                imageVisible ? 'opacity-100' : 'absolute inset-0 opacity-0'
              )}
            />
          )}

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
