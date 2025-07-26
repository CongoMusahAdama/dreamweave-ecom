import { Instagram, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/lovable-uploads/5b904431-50ea-45f9-a2e1-42008eaf5466.png" 
              alt="HARV DREAMS" 
              className="h-8 w-auto mb-4 filter brightness-0 invert"
            />
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Dream-driven streetwear from Ghana. We create authentic pieces 
              that inspire you to chase your dreams boldly.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/shop" className="text-primary-foreground/80 hover:text-white transition-colors">Shop</a></li>
              <li><a href="/dream-log" className="text-primary-foreground/80 hover:text-white transition-colors">Dream Log</a></li>
              <li><a href="/about" className="text-primary-foreground/80 hover:text-white transition-colors">About</a></li>
              <li><a href="/contact" className="text-primary-foreground/80 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/shipping" className="text-primary-foreground/80 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="/returns" className="text-primary-foreground/80 hover:text-white transition-colors">Returns</a></li>
              <li><a href="/size-guide" className="text-primary-foreground/80 hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="/faq" className="text-primary-foreground/80 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-primary-foreground/20 pt-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-primary-foreground/80">Accra, Ghana</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-primary-foreground/80">hello@harvdreams.com</span>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-primary-foreground/60 text-sm mb-4 md:mb-0">
              © 2024 HARV DREAMS. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;