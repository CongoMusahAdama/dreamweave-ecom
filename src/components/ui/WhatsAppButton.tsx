import { MessageCircle } from 'lucide-react';
import { buildSupportMessage, openWhatsApp } from '@/lib/whatsapp';

const WhatsAppButton = () => {
  const handleClick = () => {
    openWhatsApp(buildSupportMessage());
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[90] bg-black text-white pl-3 pr-4 sm:pl-4 sm:pr-5 py-2.5 sm:py-3 rounded-full shadow-2xl hover:bg-army-green transition-colors duration-300 flex items-center gap-2 max-w-[calc(100vw-2rem)]"
      aria-label="Contact us for support on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 shrink-0" strokeWidth={1.5} aria-hidden />
      <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase">
        <span className="sm:hidden">Support</span>
        <span className="hidden sm:inline">Contact us for support</span>
      </span>
    </button>
  );
};

export default WhatsAppButton;
