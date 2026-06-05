import { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CheckoutOptions from '@/components/shop/CheckoutOptions';
import AuthModal from '@/components/auth/AuthModal';
import DeliveryDetailsModal from '@/components/account/DeliveryDetailsModal';
import { buildCartOrderMessage } from '@/lib/whatsapp';
import { getDeliveryFromUser } from '@/lib/delivery';
import { useShopCheckout } from '@/hooks/useShopCheckout';

const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { login, isAuthenticated, user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [savingDelivery, setSavingDelivery] = useState(false);
  const {
    deliveryModalOpen,
    setDeliveryModalOpen,
    pendingChannel,
    startWhatsAppCheckout,
    startPaystackCheckout,
    completeWithDelivery,
    paystackLoading,
    paystackEnabled,
  } = useShopCheckout();

  const cartOrderItems = () =>
    cart.map((item) => ({
      productId: item.id,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      priceAmount: item.priceAmount,
    }));

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const delivery = getDeliveryFromUser(user);
    const message = buildCartOrderMessage(cart, cartTotal, delivery);
    startWhatsAppCheckout(message, cartOrderItems(), cartTotal);
    closeCart();
  };

  const handlePaystackCheckout = () => {
    if (cart.length === 0) return;
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    const result = startPaystackCheckout(cartOrderItems(), cartTotal);
    if (result.needsAuth) setAuthOpen(true);
    else closeCart();
  };

  return (
    <>
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full md:w-[400px] bg-white border-l border-black/10 transform transition-transform duration-500 z-[100] flex flex-col',
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-6 md:p-8 border-b border-black/10 flex items-center justify-between">
          <h2 className="heading-display text-xl text-black">Cart</h2>
          <button type="button" onClick={closeCart} aria-label="Close cart">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-10 h-10 mx-auto text-black/10 mb-4" strokeWidth={1.5} />
              <p className="text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase">
                Your cart is empty
              </p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.id}-${item.size}-${idx}`}
                className="flex gap-5 border-b border-black/10 pb-6 last:border-0"
              >
                <div className="w-20 aspect-[3/4] bg-[#f7f7f7] overflow-hidden shrink-0">
                  <img src={item.frontImage} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between gap-2">
                    <h3 className="text-[10px] font-bold tracking-widest uppercase">{item.name}</h3>
                    <p className="text-[12px] font-bold shrink-0">{item.price}</p>
                  </div>
                  <p className="text-[10px] text-black/40 mt-1 uppercase">Size {item.size}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="inline-flex items-center gap-1 text-[8px] font-bold tracking-widest text-black/40 hover:text-red-700 uppercase ml-auto min-h-[36px]"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3 h-3" strokeWidth={2} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 md:p-8 border-t border-black/10 space-y-5">
            <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase">
              <span>Total</span>
              <span>₵{cartTotal}</span>
            </div>

            <CheckoutOptions
              isAuthenticated={isAuthenticated}
              paystackEnabled={paystackEnabled}
              onWhatsApp={handleWhatsAppCheckout}
              onPaystack={handlePaystackCheckout}
              onSignIn={() => setAuthOpen(true)}
              paystackLoading={paystackLoading}
              whatsAppLabel="Checkout on WhatsApp"
            />
          </div>
        )}
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black/30 z-[90]" onClick={closeCart} aria-hidden />
      )}

      <DeliveryDetailsModal
        open={deliveryModalOpen}
        onClose={() => setDeliveryModalOpen(false)}
        saving={savingDelivery}
        submitLabel={pendingChannel === 'paystack' ? 'Continue to Paystack' : 'Continue to WhatsApp'}
        subtitle={
          pendingChannel === 'paystack'
            ? 'Add your delivery details before card payment.'
            : 'Add your delivery info so we can prefill WhatsApp checkout and track your order.'
        }
        onSave={async (delivery) => {
          setSavingDelivery(true);
          try {
            await completeWithDelivery(delivery);
          } finally {
            setSavingDelivery(false);
          }
        }}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={async (token, userData) => {
          await login(token, userData);
          setAuthOpen(false);
        }}
        initialMode="login"
      />
    </>
  );
};

export default CartDrawer;
