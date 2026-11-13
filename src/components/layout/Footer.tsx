import { Instagram, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import PaymentMethods from '@/components/layout/PaymentMethods';
import SiteLogo from '@/components/brand/SiteLogo';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { SOCIAL_LINKS } from '@/lib/social';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const Footer = () => {
  const year = new Date().getFullYear();
  const { storeEmail, storeCity } = useSiteSettings();
  return (
    <footer className="bg-army-green-dark text-white pt-10 pb-6 md:pt-14 md:pb-8 border-t border-black/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 lg:gap-8 mb-8 md:mb-10">
          
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <SiteLogo variant="dark" className="h-10 md:h-12 max-w-[200px]" />
            </Link>
            <div className="flex items-center gap-6">
              <a
                href={SOCIAL_LINKS[0].href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_LINKS[0].label}
                className="text-white/40 hover:text-white transition-colors"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS[1].href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_LINKS[1].label}
                className="text-white/40 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href={SOCIAL_LINKS[2].href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_LINKS[2].label}
                className="text-white/40 hover:text-white transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4 text-white/40">Collections</h3>
            <ul className="space-y-2.5">
              <li><Link to="/products" className="text-sm hover:text-white/60 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=tees" className="text-sm hover:text-white/60 transition-colors">Tees</Link></li>
              <li><Link to="/products?category=longsleeves" className="text-sm hover:text-white/60 transition-colors">Long Sleeves</Link></li>
              <li><Link to="/products?category=bottoms" className="text-sm hover:text-white/60 transition-colors">Bottoms</Link></li>
              <li><Link to="/products?category=accessories" className="text-sm hover:text-white/60 transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4 text-white/40">Information</h3>
            <ul className="space-y-2.5">
              <li><Link to="/gallery" className="text-sm hover:text-white/60 transition-colors">Gallery</Link></li>
              <li><Link to="/shipping" className="text-sm hover:text-white/60 transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/shipping#returns" className="text-sm hover:text-white/60 transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-white/60 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4 text-white/40">Newsletter</h3>
            <p className="text-sm text-white/60 mb-4 leading-[1.6]">
              Join the dream. Subscribe for early access to drops and exclusive content.
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-transparent border-b border-white/20 pb-2 text-[10px] tracking-widest focus:border-white transition-colors outline-none uppercase"
                required
              />
              <button 
                type="submit"
                className="absolute right-0 bottom-2 text-[10px] font-bold tracking-widest hover:text-white/60 transition-colors"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        <PaymentMethods variant="dark" className="mb-6" />

        {/* Bottom Bar */}
        <div className="pt-5 border-t border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
            © {year} HARV DREAMS. All rights reserved. Proudly Ghanaian.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center text-[10px] tracking-[0.2em] text-white/30 uppercase">
              <MapPin className="w-3 h-3 mr-2" strokeWidth={1.5} />
              {storeCity}
            </div>
            <a
              href={`mailto:${storeEmail}`}
              className="flex items-center text-[10px] tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase"
            >
              <Mail className="w-3 h-3 mr-2" strokeWidth={1.5} />
              {storeEmail}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;