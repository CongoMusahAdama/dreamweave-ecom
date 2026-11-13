import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutOptionsProps {
  isAuthenticated: boolean;
  paystackEnabled?: boolean;
  onCheckout: () => void;
  onSignIn?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

/** Single checkout button — payment is handled securely by Paystack (card or MoMo). */
const CheckoutOptions = ({
  isAuthenticated,
  paystackEnabled = false,
  onCheckout,
  onSignIn,
  disabled = false,
  loading = false,
  className,
}: CheckoutOptionsProps) => (
  <div className={cn('space-y-3', className)}>
    <button
      type="button"
      onClick={onCheckout}
      disabled={disabled || loading || !paystackEnabled}
      className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 min-h-[52px] text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-black/85 transition-colors disabled:opacity-40 touch-manipulation"
    >
      <Lock className="w-3.5 h-3.5" strokeWidth={2.5} />
      {loading ? 'Opening checkout…' : 'Checkout'}
    </button>

    {!paystackEnabled ? (
      <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-black/45 text-center leading-[1.7]">
        Checkout is temporarily unavailable — please try again shortly.
      </p>
    ) : !isAuthenticated && onSignIn ? (
      <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-black/50 text-center leading-[1.7]">
        <button
          type="button"
          onClick={onSignIn}
          className="underline underline-offset-2 hover:text-black uppercase"
        >
          Sign in
        </button>{' '}
        or{' '}
        <button
          type="button"
          onClick={onSignIn}
          className="underline underline-offset-2 hover:text-black uppercase"
        >
          create an account
        </button>{' '}
        to checkout
      </p>
    ) : (
      <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-black/40 text-center leading-[1.7]">
        Secure payment — card or mobile money
      </p>
    )}
  </div>
);

export default CheckoutOptions;
