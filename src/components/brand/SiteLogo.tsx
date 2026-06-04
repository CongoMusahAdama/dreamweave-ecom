import { cn } from '@/lib/utils';
import {
  SITE_LOGO_ALT,
  SITE_LOGO_NAV,
  SITE_LOGO_NAV_2X,
  SITE_LOGO_NAV_HEIGHT,
  SITE_LOGO_NAV_WIDTH,
  SITE_LOGO_SRC,
} from '@/lib/brand';

type SiteLogoVariant = 'light' | 'dark' | 'hero';
type SiteLogoSize = 'nav' | 'full';

type SiteLogoProps = {
  /** light/hero = logo as-is (dark on white); dark = inverted for army footer */
  variant?: SiteLogoVariant;
  /** nav = crisp header assets; full = large master PNG */
  size?: SiteLogoSize;
  className?: string;
};

const SiteLogo = ({ variant = 'light', size = 'nav', className }: SiteLogoProps) => {
  const isNav = size === 'nav';

  return (
    <img
      src={isNav ? SITE_LOGO_NAV : SITE_LOGO_SRC}
      srcSet={
        isNav ? `${SITE_LOGO_NAV} 1x, ${SITE_LOGO_NAV_2X} 2x` : undefined
      }
      width={isNav ? SITE_LOGO_NAV_WIDTH : 1016}
      height={isNav ? SITE_LOGO_NAV_HEIGHT : 598}
      alt={SITE_LOGO_ALT}
      className={cn(
        'w-auto object-contain [image-rendering:auto]',
        variant === 'dark' && 'invert',
        className
      )}
      decoding="async"
      fetchPriority="high"
    />
  );
};

export default SiteLogo;
