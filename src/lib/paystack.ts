type PaystackSetupConfig = {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref: string;
  metadata?: Record<string, unknown>;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
};

type PaystackHandler = {
  openIframe: () => void;
};

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: PaystackSetupConfig) => PaystackHandler;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

export function loadPaystackScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Paystack is only available in the browser'));
  }
  if (window.PaystackPop) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-paystack-inline]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Paystack')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.dataset.paystackInline = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack'));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export async function openPaystackPayment(config: PaystackSetupConfig) {
  await loadPaystackScript();
  if (!window.PaystackPop) {
    throw new Error('Paystack is not available');
  }
  const handler = window.PaystackPop.setup(config);
  handler.openIframe();
}

/** GHS amount → Paystack amount in pesewas */
export function toPaystackAmount(ghsTotal: number) {
  return Math.round(ghsTotal * 100);
}
