import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useShopCatalog } from '@/contexts/ShopCatalogContext';
import { sortShopProductsNewestFirst } from '@/lib/shop-catalog';
import { cn } from '@/lib/utils';

const SESSION_KEY = 'harv_new_arrivals_shown';
const AUTO_CLOSE_DELAY = 8000; // 8 seconds
const SHOW_DELAY = 1500;       // 1.5s after page load
const MAX_PRODUCTS = 4;

const NewArrivalsPopup = () => {
  const { products } = useShopCatalog();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const newestProducts = sortShopProductsNewestFirst(products).slice(0, MAX_PRODUCTS);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem(SESSION_KEY)) return;
    if (newestProducts.length === 0) return;

    const showTimer = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, '1');
      setIsOpen(true);
      // Animate in
      requestAnimationFrame(() => setTimeout(() => setIsVisible(true), 20));

      // Progress bar countdown
      const start = Date.now();
      progressRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 100 - (elapsed / AUTO_CLOSE_DELAY) * 100);
        setProgress(remaining);
      }, 50);

      // Auto close
      timerRef.current = setTimeout(() => close(), AUTO_CLOSE_DELAY);
    }, SHOW_DELAY);

    return () => clearTimeout(showTimer);
  }, [newestProducts.length]);

  const close = () => {
    setIsVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setTimeout(() => setIsOpen(false), 400);
  };

  if (!isOpen || newestProducts.length === 0) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-end sm:items-center justify-center transition-all duration-400',
        isVisible ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
      )}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        className={cn(
          'relative w-full sm:max-w-2xl bg-white shadow-2xl transition-all duration-400 ease-out',
          'sm:mx-4',
          isVisible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-95'
        )}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 h-[2px] bg-black/10 w-full overflow-hidden">
          <div
            className="h-full bg-black transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-7 pb-5 border-b border-black/10">
          <div>
            <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-black/40 mb-1">
              Just dropped
            </p>
            <h2 className="text-[13px] font-bold tracking-[0.2em] uppercase text-black">
              New Arrivals
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black transition-colors"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-black/10">
          {newestProducts.map((product) => {
            const isSoldOut = product.stock === 0;
            return (
              <Link
                key={product.id}
                to={isSoldOut ? '#' : `/products/${product.id}`}
                onClick={close}
                className={cn(
                  'group bg-white flex flex-col items-center text-center p-4 transition-colors hover:bg-black/[0.02]',
                  isSoldOut && 'pointer-events-none'
                )}
              >
                <div className="relative w-full aspect-square mb-3 overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={product.frontImage}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="text-[8px] font-bold tracking-[0.2em] uppercase bg-black text-white px-3 py-1.5">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-[8px] font-bold tracking-[0.18em] uppercase text-black/40 mb-0.5 truncate w-full">
                  {product.category}
                </p>
                <h3 className="text-[9px] font-bold tracking-[0.15em] uppercase text-black mb-1 leading-snug line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-[11px] font-bold text-black">{product.price}</p>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between">
          <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-black/30">
            Auto-closing in a moment…
          </p>
          <Link to="/products" onClick={close}>
            <button
              type="button"
              className="text-[9px] font-bold tracking-[0.2em] uppercase text-black border-b border-black pb-px hover:opacity-60 transition-opacity"
            >
              View all →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPopup;
