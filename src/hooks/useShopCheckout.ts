import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePaystack } from '@/contexts/PaystackContext';
import { apiFetch } from '@/lib/api';
import { getDeliveryFromUser, isDeliveryComplete, deliveryToAddressPayload } from '@/lib/delivery';
import { openPaystackPayment } from '@/lib/paystack';
import { openWhatsApp } from '@/lib/whatsapp';
import { sweetError, sweetSuccess } from '@/lib/sweet-alert';
import type { DeliveryDetails, ShopOrderItem } from '@/types/customer';

type CheckoutChannel = 'whatsapp' | 'paystack';

type PendingCheckout = {
  channel: CheckoutChannel;
  message?: string;
  items: ShopOrderItem[];
  totalAmount: number;
};

export function useShopCheckout() {
  const { user, token, isAuthenticated, refreshUser } = useAuth();
  const { enabled: paystackEnabled } = usePaystack();
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState<PendingCheckout | null>(null);
  const [paystackLoading, setPaystackLoading] = useState(false);
  const [pendingChannel, setPendingChannel] = useState<CheckoutChannel>('whatsapp');

  const runWhatsAppCheckout = useCallback(
    async (
      message: string,
      items: ShopOrderItem[],
      totalAmount: number,
      delivery?: DeliveryDetails | null
    ) => {
      if (token && delivery) {
        try {
          await apiFetch('/api/shop-orders', {
            method: 'POST',
            token,
            body: JSON.stringify({
              items,
              shippingAddress: delivery,
              totalAmount,
              channel: 'whatsapp',
            }),
          });
        } catch (e) {
          console.error('Order log failed:', e);
        }
      }
      openWhatsApp(message);
    },
    [token]
  );

  const runPaystackCheckout = useCallback(
    async (items: ShopOrderItem[], totalAmount: number, delivery: DeliveryDetails) => {
      if (!token || !user?.email) {
        sweetError('Sign in required', 'Please sign in to pay with Paystack.');
        return;
      }

      setPaystackLoading(true);
      try {
        const init = await apiFetch<{
          success: boolean;
          message?: string;
          data: {
            reference: string;
            publicKey: string;
            amount: number;
            orderId: string;
          };
        }>('/api/payments/initialize', {
          method: 'POST',
          token,
          body: JSON.stringify({
            items,
            shippingAddress: delivery,
            totalAmount,
          }),
        });

        const { reference, publicKey, amount } = init.data;

        await openPaystackPayment({
          key: publicKey,
          email: user.email,
          amount,
          currency: 'GHS',
          ref: reference,
          metadata: { orderId: init.data.orderId },
          callback: async (response) => {
            try {
              await apiFetch(`/api/payments/verify/${encodeURIComponent(response.reference)}`, {
                token,
              });
              sweetSuccess(
                'Payment received',
                'Your order is confirmed. Open Account → Orders to track it.'
              );
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('harv:order-paid'));
              }
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Could not verify payment';
              sweetError('Payment verification failed', msg);
            }
          },
          onClose: () => {},
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Could not start Paystack payment';
        sweetError('Paystack unavailable', msg);
      } finally {
        setPaystackLoading(false);
      }
    },
    [token, user?.email]
  );

  const completePending = useCallback(
    async (delivery: DeliveryDetails) => {
      if (!pendingCheckout) return;
      const pending = pendingCheckout;
      setPendingCheckout(null);
      setDeliveryModalOpen(false);

      if (pending.channel === 'whatsapp' && pending.message) {
        await runWhatsAppCheckout(pending.message, pending.items, pending.totalAmount, delivery);
      } else if (pending.channel === 'paystack') {
        await runPaystackCheckout(pending.items, pending.totalAmount, delivery);
      }
    },
    [pendingCheckout, runWhatsAppCheckout, runPaystackCheckout]
  );

  const resolveDelivery = useCallback(
    (inline?: DeliveryDetails | null) => {
      if (inline && isDeliveryComplete(inline)) return inline;
      if (isAuthenticated) return getDeliveryFromUser(user);
      return inline && isDeliveryComplete(inline) ? inline : null;
    },
    [isAuthenticated, user]
  );

  const queueCheckout = useCallback(
    (
      channel: CheckoutChannel,
      items: ShopOrderItem[],
      totalAmount: number,
      message?: string,
      options?: { delivery?: DeliveryDetails | null }
    ): { needsAuth?: true; needsDelivery?: true; missingDelivery?: true; ok?: true } => {
      if (channel === 'paystack' && !isAuthenticated) {
        return { needsAuth: true };
      }

      if (channel === 'paystack' && !paystackEnabled) {
        sweetError(
          'Card payment unavailable',
          'Paystack is not configured yet. Please checkout on WhatsApp or sign in later.'
        );
        return {};
      }

      const delivery = resolveDelivery(options?.delivery);

      if (!isDeliveryComplete(delivery)) {
        if (options?.delivery) {
          return { missingDelivery: true };
        }
        if (isAuthenticated) {
          setPendingChannel(channel);
          setPendingCheckout({ channel, message, items, totalAmount });
          setDeliveryModalOpen(true);
          return { needsDelivery: true };
        }
        return { missingDelivery: true };
      }

      if (channel === 'whatsapp' && message) {
        void runWhatsAppCheckout(message, items, totalAmount, delivery);
      } else if (channel === 'paystack' && delivery) {
        void runPaystackCheckout(items, totalAmount, delivery);
      }

      return { ok: true };
    },
    [isAuthenticated, paystackEnabled, resolveDelivery, runWhatsAppCheckout, runPaystackCheckout]
  );

  const startWhatsAppCheckout = useCallback(
    (
      message: string,
      items: ShopOrderItem[],
      totalAmount: number,
      options?: { delivery?: DeliveryDetails | null }
    ) => queueCheckout('whatsapp', items, totalAmount, message, options),
    [queueCheckout]
  );

  const startPaystackCheckout = useCallback(
    (items: ShopOrderItem[], totalAmount: number, options?: { delivery?: DeliveryDetails | null }) =>
      queueCheckout('paystack', items, totalAmount, undefined, options),
    [queueCheckout]
  );

  const completeWithDelivery = useCallback(
    async (delivery: DeliveryDetails) => {
      if (!token) return;
      await apiFetch('/api/auth/profile', {
        method: 'PUT',
        token,
        body: JSON.stringify(deliveryToAddressPayload(delivery)),
      });
      await refreshUser();
      await completePending();
    },
    [token, refreshUser, completePending]
  );

  return {
    deliveryModalOpen,
    setDeliveryModalOpen,
    pendingChannel,
    startWhatsAppCheckout,
    startPaystackCheckout,
    completeWithDelivery,
    paystackLoading,
    paystackEnabled,
    /** @deprecated use startWhatsAppCheckout */
    startCheckout: startWhatsAppCheckout,
  };
}
