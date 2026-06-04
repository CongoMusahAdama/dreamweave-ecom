import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

type RevealVariant = 'fade-up' | 'fade' | 'scale' | 'product';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
}

const variantClass: Record<RevealVariant, string> = {
  'fade-up': 'reveal-fade-up',
  fade: 'reveal-fade',
  scale: 'reveal-scale',
  product: 'reveal-product',
};

const ScrollReveal = ({
  children,
  className,
  variant = 'fade-up',
  delay = 0,
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const style = delay ? ({ ['--reveal-delay' as string]: `${delay}ms` } as CSSProperties) : undefined;

  return (
    <div
      ref={ref}
      className={cn(variantClass[variant], isVisible && 'reveal-visible', className)}
      style={style}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
